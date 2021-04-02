import {
	ACTIVE,
	COMMANDS,
} from './constants';

export default {
	[ACTIVE](state) {
		return state.active;
	},
	[COMMANDS](state) {
		return state.commands || [];
	},
};
