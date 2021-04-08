import {
	ACTIVE,
	PROMPT,
	INTRO,
	CONTAINER_ID,
} from './constants';

export default {
	[ACTIVE](state) {
		return state.active;
	},
	[PROMPT](state) {
		return state.prompt;
	},
	[INTRO](state) {
		return state.intro;
	},
	[CONTAINER_ID](state) {
		return state.containerId;
	},
};
