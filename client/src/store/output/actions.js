import Vue from 'vue';
import decompress from '@/helpers/decompress';
import { CodeService } from '@/services/code';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view';
import {
	RUN_CODE,
	RESET_IMMUDB,
	RESET_MERKLE_TREE,
	RESET_OUTPUT,
	APPEND_CODE_HISTORY,
	SET_IMMUDB,
	SET_MERKLE_TREE,
	SET_MERKLE_TREE_MODE,
	APPEND_CODE_OUTPUT,
} from './constants';

export default {
	async [RUN_CODE]({ commit }, payload) {
		const LOADING_LABEL = 'runCode';
		try {
			if (payload) {
				commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL }, { root: true });

				const { code, immudb } = payload;

				if (code) {
					commit(APPEND_CODE_HISTORY, {
						//
					});

					const params = {
						code,
						immudb: immudb || '',
					};

					const { data } = await CodeService.runCode(params);

					if (data) {
						const { immudb, tree, output } = data;

						commit(SET_IMMUDB, {
							immudb,
						});

						const decompressedTree = decompress(tree) || '';
						const jsonDecompressedTree = decompressedTree && JSON.parse(decompressedTree);

						commit(SET_MERKLE_TREE, {
							graph: await Vue.prototype.$workers
									.parseMerkleTreeGraph(jsonDecompressedTree, 12),
							json: jsonDecompressedTree,
							size: jsonDecompressedTree && jsonDecompressedTree.length,
						});

						commit(APPEND_CODE_OUTPUT, {
							output,
						});
					}

					commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });

					return data;
				}
			}
			else {
				console.log('a payload is needed to run code');
			}
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
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
	[SET_MERKLE_TREE_MODE]({ commit }, payload) {
		commit(SET_MERKLE_TREE_MODE, payload);
	},
	[APPEND_CODE_OUTPUT]({ commit }, payload) {
		commit(APPEND_CODE_OUTPUT, payload);
	},
};
