import Vue from 'vue';

const TABLES_TREE_WORKER = 'tablesTree';

const SHOW_TABLES_TREE_PERFORMANCE = false;

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
						message: TABLES_TREE_WORKER,
						func: (arg) => {
							try {
								const t0 = performance.now();
								const { data, showPerformance } = arg || {};
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
									console.log(`parseTablesTree took ${ performance.now() - t0 } ms`);
								}

								return hashTable;
							}
							catch (err) {
								console.error('ERR: tables tree parse', err);
							}
						},
					},
				]));
				resolve(this.workers);
			});
		},
		async parseTablesTree (data) {
			if (!this.workers) {
				this.workers = await this.initWorkers();
			}
			console.log('INPUT', data);
			return this.workers.postMessage(TABLES_TREE_WORKER, [{
				data,
				showPerformance: SHOW_TABLES_TREE_PERFORMANCE,
			}])
					.then(result => result)
					.catch(err => console.error(err));
		},
	},
};
