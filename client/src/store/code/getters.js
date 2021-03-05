import {
	IMMUDB,
	MERKLE_TREE,
	CODE_OUTPUT,
	CODE_HISTORY,
} from './constants';

export default {
	[IMMUDB](state) {
		return state.immudb || '';
	},
	[MERKLE_TREE](state) {
		return state.merkleTree || '';
	},
	[CODE_OUTPUT](state) {
		return state.codeOutput || {};
	},
	[CODE_HISTORY](state) {
		return state.codeHistory || [];
	},
};
