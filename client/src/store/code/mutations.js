import {
	APPEND_CODE_HISTORY,
	SET_IMMUDB,
	SET_MERKLE_TREE,
	SET_CODE_OUTPUT,
} from './constants';

export default {
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
			const { merkleTree } = payload;
			console.log(typeof merkleTree);
			state.merkleTree = merkleTree;
		}
	},
	[SET_CODE_OUTPUT](state, payload) {
		if (payload) {
			const { stderr, stdout } = payload;
			stdout && (state.codeOutput.stdout = stdout);
			stderr && (state.codeOutput.stderr = stderr);
		}
	},
};
