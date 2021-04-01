import Vue from 'vue';
import {
	SET_GUIDES,
	SET_ACTIVE_GUIDE,
} from './constants';

export default {
	[SET_GUIDES](state, payload) {
		const { guides } = payload;
		state.guides = guides;
	},
	[SET_ACTIVE_GUIDE](state, payload) {
		if (payload) {
			const {
				slug,
				title,
				documentation,
				createdAt,
				updatedAt,
			} = payload;
			Vue.set(state.activeGuide, 'slug', slug);
			Vue.set(state.activeGuide, 'title', title);
			Vue.set(state.activeGuide, 'documentation', documentation);
			Vue.set(state.activeGuide, 'createdAt', createdAt);
			Vue.set(state.activeGuide, 'updatedAt', updatedAt);
			Vue.set(state.activeGuide, 'guide', payload);
		}
	},
};
