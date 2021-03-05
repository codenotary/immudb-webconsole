import {
	SET_INFO,
} from './constants';

export default {
	[SET_INFO](state, payload) {
		if (payload) {
			const { version } = payload;
			version && (state.version = version);
		}
	},
};
