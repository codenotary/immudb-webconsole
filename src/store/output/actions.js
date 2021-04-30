import {
	RESET_OUTPUT,
	APPEND_CODE_OUTPUT,
} from './constants';

export default {
	[RESET_OUTPUT]({ commit }) {
		commit(RESET_OUTPUT);
	},
	[APPEND_CODE_OUTPUT]({ commit }, payload) {
		commit(APPEND_CODE_OUTPUT, payload);
	},
};
