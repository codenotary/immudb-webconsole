import {
	RESET_OUTPUT,
	SET_CODE_OUTPUT,
	APPEND_CODE_OUTPUT,
	SET_FILTER,
} from './constants';

export default {
	[RESET_OUTPUT](state) {
		state.output = [];
	},
	[SET_CODE_OUTPUT](state, payload) {
		if (payload) {
			const { output } = payload;
			output && (state.output = output);
		}
	},
	[APPEND_CODE_OUTPUT](state, payload) {
		if (payload) {
			const { output } = payload;
			if (output && output.length) {
				state.output = [
					...state.output,
					...output,
					{ divider: true },
				];
			}
			else if (output) {
				state.output = [
					...state.output,
					output,
					{ divider: true },
				];
			}
		}
	},
	[SET_FILTER](state, payload) {
		state.filter = payload;
	},
};
