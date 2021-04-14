import {
	SET_CONTAINER_ID,
	SET_LIVE_ACTIVE,
	SET_INTRO,
	SET_IN_PROGRESS,
	SET_PROMPT,
	SET_POINTER,
	SET_TERM_STDIN,
	APPEND_OUTPUT,
	APPEND_EXECUTED,
	SET_HISTORY,
	SET_EXECUTED,
	SET_COMMAND,
} from './constants';

export default {
	[SET_LIVE_ACTIVE](state, payload) {
		if (payload) {
			const { active } = payload;
			state.active = active;
		}
	},
	[SET_IN_PROGRESS](state, payload) {
		state.inProgress = payload;
	},
	[SET_PROMPT](state, payload) {
		if (payload) {
			const { prompt } = payload;
			state.prompt = prompt;
		}
	},
	[APPEND_OUTPUT](state, payload) {
		if (payload && state.history && state.history.length) {
			state.history = [...state.history, payload];
		}
		else if (payload) {
			state.history = [payload];
		}
	},
	[APPEND_EXECUTED](state, payload) {
		if (payload && state.executed && state.executed.length) {
			state.executed = [...state.executed, payload];
		}
		else if (payload) {
			state.executed = [payload];
		}
	},
	[SET_HISTORY](state, payload) {
		state.history = payload;
	},
	[SET_EXECUTED](state, payload) {
		state.executed = payload;
	},
	[SET_POINTER](state, payload) {
		if (payload) {
			const { pointer } = payload;
			state.pointer = pointer;
		}
	},
	[SET_TERM_STDIN](state, payload) {
		if (payload) {
			const { termStdin } = payload;
			state.termStdin = termStdin;
		}
	},
	[SET_INTRO](state, payload) {
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
	[SET_COMMAND](state, payload) {
		state.command = payload;
	},
};
