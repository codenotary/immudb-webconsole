import {
	SET_LIVE_ACTIVE,
	SET_LIVE_INTRO,
	SET_CONTAINER_ID,
} from './constants';

export default {
	[SET_LIVE_ACTIVE](state, payload) {
		if (payload) {
			const { active } = payload;
			state.active = active;
		}
	},
	[SET_LIVE_INTRO](state, payload) {
		if (payload) {
			const { finished, value } = payload;
			finished && (state.intro.finished = finished);
			value && (state.intro.value = value);
		}
	},
	[SET_CONTAINER_ID](state, payload) {
		if (payload) {
			const { id } = payload;
			state.containerId = id;
		}
	},
};
