import {
	RESET_IMMUDB,
	RESET_MERKLE_TREE,
	RESET_OUTPUT,
	APPEND_CODE_HISTORY,
	SET_IMMUDB,
	SET_MERKLE_TREE,
	SET_MERKLE_TREE_MODE,
	SET_CODE_OUTPUT,
	APPEND_CODE_OUTPUT,
} from './constants';

export default {
	[RESET_IMMUDB](state) {
		state.immudb = [];
	},
	[RESET_MERKLE_TREE](state) {
		state.merkleTree = {
			graph: {},
			json: [],
		};
	},
	[RESET_OUTPUT](state) {
		state.output = [];
	},
	[APPEND_CODE_HISTORY](state, payload) {
		if (payload) {
			const { code } = payload;
			state.codeHistory = [...state.codeHistory, code];
		}
	},
	[SET_IMMUDB](state, payload) {
		if (payload) {
			const { immudb } = payload;
			state.immudb = immudb;
		}
	},
	[SET_MERKLE_TREE](state, payload) {
		if (payload) {
			const { graph, json } = payload;
			console.log('PARSED GRAPH', graph);
			graph && (state.merkleTree.graph = graph);
			json && (state.merkleTree.json = json);
		}
	},
	[SET_MERKLE_TREE_MODE](state, payload) {
		if (payload) {
			const { mode } = payload;
			state.merkleTreeMode = mode;
		}
	},
	[SET_CODE_OUTPUT](state, payload) {
		if (payload) {
			const { output } = payload;
			output && (state.output = output);
		}
	},
	[APPEND_CODE_OUTPUT](state, payload) {
		if (payload) {
			const { output } = payload;
			if (output && output.length) {
				output && (state.output = [
					...state.output,
					...output,
					{ divider: true },
				]);
			}
		}
	},
};
