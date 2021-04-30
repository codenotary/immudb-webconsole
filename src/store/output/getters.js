import {
	CODE_OUTPUT,
} from './constants';

export default {
	[CODE_OUTPUT](state) {
		return state.output || [];
	},
};
