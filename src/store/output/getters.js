import {
	CODE_OUTPUT,
	FILTER,
} from './constants';

export default {
	[CODE_OUTPUT](state) {
		return state.output || [];
	},
	[FILTER](state) {
		return state.filter || 'all';
	},
};
