import Vue from 'vue';
import decompress from '@/helpers/decompress';
import {
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
