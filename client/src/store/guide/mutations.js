import Vue from 'vue';
import {
	SET_GUIDE,
	SET_ACTIVE_GUIDE,
} from './constants';

export default {
	[SET_GUIDE](state, payload) {
		const { guide } = payload;
		state.guide = guide;
	},
	[SET_ACTIVE_GUIDE](state, payload) {
		if (payload) {
			const { title, documentation, markdown } = payload;
			Vue.set(state.activeGuide, 'title', title);
			Vue.set(state.activeGuide, 'documentation', documentation);
			Vue.set(state.activeGuide, 'markdown', markdown);
		}
	},
};
