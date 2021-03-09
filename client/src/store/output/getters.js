import {
	IMMUDB,
	MERKLE_TREE,
	MERKLE_TREE_MODE,
	CODE_OUTPUT,
	CODE_HISTORY,
	DEFAULT_MERKLE_TREE_MODE,
} from './constants';

export default {
	[IMMUDB](state) {
		return state.immudb || '';
	},
	[MERKLE_TREE](state) {
		return state.merkleTree || [];
	},
	[MERKLE_TREE_MODE](state) {
		return state.merkleTreeMode || DEFAULT_MERKLE_TREE_MODE;
	},
	[CODE_OUTPUT](state) {
		return state.output || [];
	},
	[CODE_HISTORY](state) {
		return state.codeHistory || [];
	},
};
