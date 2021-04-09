import {
	SET_LIVE_ACTIVE,
	SET_PROMPT,
	ADD_HISTORY,
	ADD_EXECUTED,
	SET_POINTER,
	SET_TERM_STDIN,
	SET_INTRO,
	SET_CONTAINER_ID,
} from './constants';

export default {
	[SET_LIVE_ACTIVE](state, payload) {
		if (payload) {
			const { active } = payload;
			state.active = active;
		}
	},
	[SET_PROMPT](state, payload) {
		if (payload) {
			const { prompt } = payload;
			state.prompt = prompt;
		}
	},
	[ADD_HISTORY](state, payload) {
		if (payload) {
			const { history } = payload;
			state.history = [...state.history, history];
		}
	},
	[ADD_EXECUTED](state, payload) {
		if (payload) {
			const { executed } = payload;
			state.executed.add(executed);
		}
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
};
