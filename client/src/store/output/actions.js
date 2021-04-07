import Vue from 'vue';
import decompress from '@/helpers/decompress';
import { CodeService } from '@/services/code';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	CODE_MODULE,
	ACTIVE_LANGUAGE,
} from '@/store/code/constants';
import {
	RUN_CODE,
	RESET_IMMUDB,
	RESET_MERKLE_TREE,
	RESET_OUTPUT,
	APPEND_CODE_HISTORY,
	APPEND_IMMUDB,
	SET_IMMUDB,
	SET_MERKLE_TREE,
	SET_MERKLE_TREE_MODE,
	APPEND_CODE_OUTPUT,
	SET_METRICS,
} from './constants';

export default {
	async [RUN_CODE]({ commit, dispatch, rootGetters }, payload) {
		const LOADING_LABEL = 'runCode';
		try {
			if (payload) {
				commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL }, { root: true });

				const { code, immudb, token } = payload;
				const activeLanguage = rootGetters[`${ CODE_MODULE }/${ ACTIVE_LANGUAGE }`];
				const language = activeLanguage ? activeLanguage.label : 'python';

				if (code) {
					commit(APPEND_CODE_HISTORY, {
						//
					});

					const params = {
						code,
						language,
						immudb: immudb || '',
						token: token || '',
					};

					const { data } = await CodeService.runCode(language, params);

					if (data) {
						dispatch(APPEND_IMMUDB, data);
						const { output } = data;

						// commit(SET_IMMUDB, {
						// 	immudb,
						// 	token,
						// });

						// const decompressedTree = decompress(tree) || '';
						// const jsonDecompressedTree = decompressedTree && JSON.parse(decompressedTree);

						// commit(SET_MERKLE_TREE, {
						// 	graph: await Vue.prototype.$workers
						// 			.parseMerkleTreeGraph(jsonDecompressedTree, 6),
						// 	json: jsonDecompressedTree,
						// });

						// commit(SET_METRICS, {
						// 	size: jsonDecompressedTree && jsonDecompressedTree.length,
						// 	verified,
						// });

						commit(APPEND_CODE_OUTPUT, {
							output,
						});
					}

					commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });

					return data;
				}
			}
			else {
				console.error('a payload is needed to run code');
			}
		}
		catch (err) {
			try {
				console.error(err);
				const { data } = err && err.response;

				if (data) {
					const { output } = data;
					commit(APPEND_CODE_OUTPUT, {
						output,
					});
				}
				commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			}
			catch (err2) {
				console.error(err2);
			}
			throw err;
		}
	},
	async [APPEND_IMMUDB]({ commit }, payload) {
		const { immudb, tree, token, verified } = payload;

		commit(SET_IMMUDB, {
			immudb,
			token,
		});

		const decompressedTree = decompress(tree) || '';
		const jsonDecompressedTree = decompressedTree && JSON.parse(decompressedTree);

		commit(SET_MERKLE_TREE, {
			graph: await Vue.prototype.$workers
					.parseMerkleTreeGraph(jsonDecompressedTree, 6),
			json: jsonDecompressedTree,
		});

		commit(SET_METRICS, {
			size: jsonDecompressedTree && jsonDecompressedTree.length,
			verified,
		});
	},
	[RESET_IMMUDB]({ commit }) {
		commit(RESET_IMMUDB);
	},
	[RESET_MERKLE_TREE]({ commit }) {
		commit(RESET_MERKLE_TREE);
	},
	[RESET_OUTPUT]({ commit }) {
		commit(RESET_OUTPUT);
	},
	[APPEND_CODE_HISTORY]({ commit }, payload) {
		commit(APPEND_CODE_HISTORY, payload);
	},
	[SET_IMMUDB]({ commit }, payload) {
		commit(SET_IMMUDB, payload);
	},
	[SET_MERKLE_TREE]({ commit }, payload) {
		commit(SET_MERKLE_TREE, payload);
	},
	[SET_METRICS]({ commit }, payload) {
		commit(SET_METRICS, payload);
	},
	[SET_MERKLE_TREE_MODE]({ commit }, payload) {
		commit(SET_MERKLE_TREE_MODE, payload);
	},
	[APPEND_CODE_OUTPUT]({ commit }, payload) {
		commit(APPEND_CODE_OUTPUT, payload);
	},
};
