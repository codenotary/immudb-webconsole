import {
	ACTIVE,
	COMMANDS,
	CONTAINER_ID,
} from './constants';

export default {
	[ACTIVE](state) {
		return state.active;
	},
	[COMMANDS](state) {
		return state.commands || [];
	},
	[CONTAINER_ID](state) {
		return state.containerId;
	},
};
