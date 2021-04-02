import Vue from 'vue';

const TOPICS_TREE_WORKER = 'topicsTree';
const MERKLE_TREE_CHAIN_WORKER = 'merkleTreeChain';
const MERKLE_TREE_GRAPH_WORKER = 'merkleTreeGraph';

const SHOW_TOPICS_TREE_PERFORMANCE = false;
const SHOW_MERKLE_TREE_PERFORMANCE = false;

export const workers = {
	name: 'workers',
	data: () => ({
		workers: null,
	}),
	beforeDestroy () {
		this.workers = null;
	},
	async created () {
		await this.initWorkers();
	},
	methods: {
		initWorkers () {
			return new Promise((resolve) => {
				if (this.workers) {
					resolve('Workers have been already created');
				}
				this.workers = Object.freeze(Vue.prototype.$worker.create([
					{
						message: TOPICS_TREE_WORKER,
						func: (arg) => {
							try {
								const t0 = performance.now();
								const { data, base, showPerformance } = arg || {};
								const hashTable = Object.create(null);
								if (data && data.length) {
									data.map((_) => {
										const { active, code, dir, node, live, path, slug, sort, title } = _;
										hashTable[node ? dir : path] = {
											active,
											code,
											live,
											path,
											slug,
											sort,
											title,
											label: title,
											children: [],
										};
										const t = _;
										const parent = node ? dir.slice(0, dir.lastIndexOf('/')) : path;
										t.parent = parent;
										return t;
									});

									if (data) {
										const _leaves = data
												.filter(_ => _ && !_.node)
												.sort((a, b) => a.path.match(/\/.+?/g).length >=
													b.path.match(/\/.+?/g).length ? -1 : 1,
												);
										const _nodes = data
												.filter(_ => _ && (_.node))
												.sort((a, b) => a.path.match(/\/.+?/g).length >=
													b.path.match(/\/.+?/g).length ? -1 : 1,
												);
										_leaves.concat(_nodes)
												.slice()
												.filter(_ => _ && _.active)
												.map((_) => {
													const { dir, node, parent } = _;
													hashTable[node ? parent : dir] &&
														hashTable[node ? parent : dir].children
																.push(hashTable[node ? dir : parent]);
												});
									}
								}

								if (showPerformance) {
									console.log(`parseTopicsTree took ${ performance.now() - t0 } ms`);
								}

								return hashTable[`/${ base }`] &&
									hashTable[`/${ base }`].children;
							}
							catch (err) {
								console.error('ERR: topics tree parse', err);
							}
						},
					},
					{
						message: MERKLE_TREE_CHAIN_WORKER,
						func: (arg) => {
							try {
								const t0 = performance.now();
								const { data, showPerformance } = arg || {};
								let result = [];

								// PARSE DATA
								const hashTable = Object.create(null);
								data && data.map((_, idx) => {
									const { root } = _;
									hashTable[root] = {
										id: idx,
										label: root,
										children: [],
									};
								});
								data && data.map((_) => {
									const { metadata, root } = _;
									const { prevroot } = metadata;
									if (prevroot && hashTable[prevroot]) {
										hashTable[prevroot].children
												.push(hashTable[root]);
									}
									else {
										result = hashTable[root];
									}
								});

								if (showPerformance) {
									console.log(`parseMerkleTreeGraph took ${ performance.now() - t0 } ms`);
								}

								return result;
							}
							catch (err) {
								console.error('ERR: merkle tree chain parse', err);
							}
						},
					},
					{
						message: MERKLE_TREE_GRAPH_WORKER,
						func: (arg) => {
							try {
								const t0 = performance.now();
								const { data, labelLength, showPerformance } = arg || {};
								const hashTable = Object.create(null);
								let rootHtree = '';

								if (data && data.length) {
									rootHtree = data[data.length - 1].htree;

									data.map((_, idx) => {
										const { metadata, entries, root, htree } = _;
										hashTable[htree] = {
											id: idx,
											label: htree && htree.slice(0, labelLength) +
												(htree.length > labelLength ? '...' : ''),
											data: { htree, root, metadata, entries },
											children: [],
										};
									});

									data
											.slice()
											.reverse()
											.map((_) => {
												const { htree, hchild } = _;
												hchild && hchild.map((c) => {
													if (c && hashTable[c]) {
														hashTable[htree].children.push(hashTable[c]);
													}
												});
											});
								}

								if (showPerformance) {
									console.log(`parseMerkleTreeGraph took ${ performance.now() - t0 } ms`);
								}

								return hashTable[rootHtree];
							}
							catch (err) {
								console.error('ERR: merkle tree graph parse', err);
							}
						},
					},
				]));
				resolve(this.workers);
			});
		},
		async parseTopicsTree (data, base) {
			if (!this.workers) {
				this.workers = await this.initWorkers();
			}
			return this.workers.postMessage(TOPICS_TREE_WORKER, [{
				data,
				base,
				showPerformance: SHOW_TOPICS_TREE_PERFORMANCE,
			}])
					.then(result => result)
					.catch(err => console.error(err));
		},
		async parseMerkleTreeChain (data) {
			if (!this.workers) {
				this.workers = await this.initWorkers();
			}
			return this.workers.postMessage(MERKLE_TREE_CHAIN_WORKER, [{
				data,
				showPerformance: SHOW_MERKLE_TREE_PERFORMANCE,
			}])
					.then(result => result)
					.catch(err => console.error(err));
		},
		async parseMerkleTreeGraph (data, labelLength) {
			if (!this.workers) {
				this.workers = await this.initWorkers();
			}
			return this.workers.postMessage(MERKLE_TREE_GRAPH_WORKER, [{
				data,
				labelLength,
				showPerformance: SHOW_MERKLE_TREE_PERFORMANCE,
			}])
					.then(result => result)
					.catch(err => console.error(err));
		},
	},
};
