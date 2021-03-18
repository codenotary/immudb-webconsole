import Vue from 'vue';

const MERKLE_TREE_CHAIN_WORKER = 'merkleTreeChain';
const MERKLE_TREE_GRAPH_WORKER = 'merkleTreeGraph';

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
									rootHtree = data[data.length - 1].tree;

									data.map((_, idx) => {
										const { metadata, entries, root, tree } = _;
										hashTable[tree] = {
											id: idx,
											label: tree && tree.slice(0, labelLength) +
												(tree.length > labelLength ? '...' : ''),
											data: { tree, root, metadata, entries },
											children: [],
										};
									});

									data
											.slice()
											.reverse()
											.map((_) => {
												const { tree, hchild } = _;
												hchild && hchild.map((c) => {
													if (c && hashTable[c]) {
														hashTable[tree].children.push(hashTable[c]);
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
