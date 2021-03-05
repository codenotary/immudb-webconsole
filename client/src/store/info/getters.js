import {
	VERSION,
} from './constants';

export default {
	[VERSION](state) {
		return state.version || '';
	},
};
