import {
	ACTIVE,
	INTRO,
	CONTAINER_ID,
} from './constants';

export default {
	[ACTIVE](state) {
		return state.active;
	},
	[INTRO](state) {
		return state.intro;
	},
	[CONTAINER_ID](state) {
		return state.containerId;
	},
};
