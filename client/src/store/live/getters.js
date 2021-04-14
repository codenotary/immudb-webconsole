import {
	ACTIVE,
	IS_IN_PROGRESS,
	PROMPT,
	HISTORY,
	EXECUTED,
	POINTER,
	TERM_STDIN,
	INTRO,
	CONTAINER_ID,
	COMMAND,
} from './constants';

export default {
	[ACTIVE](state) {
		return state.active;
	},
	[IS_IN_PROGRESS](state) {
		return state.inProgress;
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
	[COMMAND](state) {
		return state.command;
	},
};
