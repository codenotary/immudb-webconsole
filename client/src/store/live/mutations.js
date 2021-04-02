import {
	SET_LIVE_ACTIVE,
	SET_COMMANDS,
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
};
