import {
	VERSION,
	BUILD_TIME,
} from './constants';

export default {
	[VERSION](state) {
		return state.version || '';
	},
	[BUILD_TIME](state) {
		return state.buildTime || '';
	},
};
