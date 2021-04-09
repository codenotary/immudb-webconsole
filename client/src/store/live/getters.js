import {
	ACTIVE,
	PROMPT,
	HISTORY,
	EXECUTED,
	POINTER,
	TERM_STDIN,
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
	[HISTORY](state) {
		return state.history;
	},
	[EXECUTED](state) {
		return state.executed;
	},
	[POINTER](state) {
		return state.pointer;
	},
	[TERM_STDIN](state) {
		return state.termStdin;
	},
	[INTRO](state) {
		return state.intro;
	},
	[CONTAINER_ID](state) {
		return state.containerId;
	},
};
