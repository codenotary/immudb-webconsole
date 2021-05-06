import {
	TOKEN,
	AUTHENTICATED,
} from './constants';

export default {
	[TOKEN](state) {
		return state.token;
	},
	[AUTHENTICATED](state) {
		return !!state.token;
	},
};
