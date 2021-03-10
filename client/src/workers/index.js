import Vue from 'vue';

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
						message: MERKLE_TREE_GRAPH_WORKER,
						func: (arg) => {
							try {
								const t0 = performance.now();
								const data = arg.data;
								const showPerformance = arg.showPerformance;
								let result = [];

								// PARSE DATA
								const hashTable = Object.create(null);
								data.forEach((_) => {
									const { root } = _;
									hashTable[root] = {
										label: root,
										children: [],
									};
								});
								data.forEach((_) => {
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
								console.error('ERR: merkle tree graph parse', err);
							}
						},
					},
				]));
				resolve(this.workers);
			});
		},
		async parseMerkleTreeGraph (data) {
			if (!this.workers) {
				this.workers = await this.initWorkers();
			}
			return this.workers.postMessage(MERKLE_TREE_GRAPH_WORKER, [{
				data,
				showPerformance: SHOW_MERKLE_TREE_PERFORMANCE,
			}])
					.then(result => result)
					.catch(err => console.error(err));
		},
	},
};
