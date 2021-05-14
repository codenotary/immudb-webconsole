import {
	TOKEN,
	AUTHENTICATED,
	USER,
} from './constants';

export default {
	[TOKEN](state) {
		return state.token;
	},
	[AUTHENTICATED](state) {
		return !!state.token;
	},
	[USER](state) {
		return state.user;
	},
};
