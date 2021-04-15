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
	SET_METRICS,
} from './constants';

export default {
	[RESET_IMMUDB](state) {
		state.immudb = [];
	},
	[RESET_MERKLE_TREE](state) {
		state.merkleTree = {
			graph: {},
			json: [],
			metrics: {
				size: 0,
				verified: false,
			},
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
			const { immudb, token } = payload;
			state.immudb = immudb;
			state.token = token;
		}
	},
	[SET_MERKLE_TREE](state, payload) {
		if (payload) {
			const { graph, json, metrics } = payload;
			graph && (state.merkleTree.graph = graph);
			json && (state.merkleTree.json = json);
			metrics && (state.merkleTree.metrics = metrics);
		}
	},
	[SET_METRICS](state, payload) {
		if (payload) {
			const { size, verified } = payload;
			size && (state.merkleTree.metrics.size = size);
			verified && (state.merkleTree.metrics.verified = verified);
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
