import {
	SET_INFO,
} from './constants';

export default {
	[SET_INFO](state, payload) {
		if (payload) {
			const { version, buildtime } = payload;
			version && (state.version = version);
			buildtime && (state.buildTime = buildtime * 1000);
		}
	},
};
