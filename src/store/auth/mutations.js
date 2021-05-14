import {
	SET_TOKEN,
	SET_USER,
} from './constants';

export default {
	[SET_TOKEN](state, payload) {
		state.token = payload;
	},
	[SET_USER](state, payload) {
		state.user = payload;
	},
};
