import {
	RESET_OUTPUT,
	APPEND_CODE_OUTPUT,
	SET_FILTER,
} from './constants';

export default {
	[RESET_OUTPUT]({ commit }) {
		commit(RESET_OUTPUT);
	},
	[APPEND_CODE_OUTPUT]({ commit }, payload) {
		commit(APPEND_CODE_OUTPUT, payload);
	},
	[SET_FILTER]({ commit }, payload) {
		commit(SET_FILTER, payload);
	},
};
