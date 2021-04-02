import {
	SET_LIVE_ACTIVE,
	SET_COMMANDS,
	SET_CONTAINER_ID,
} from './constants';

export default {
	[SET_LIVE_ACTIVE](state, payload) {
		if (payload) {
			const { active } = payload;
			state.active = active;
		}
	},
	[SET_COMMANDS](state, payload) {
		const { commands } = payload;
		if (commands) {
			commands && (state.commands = commands);
		}
		else {
			state.commands = [];
		}
	},
	[SET_CONTAINER_ID](state, payload) {
		if (payload) {
			const { id } = payload;
			state.containerId = id;
		}
	},
};
