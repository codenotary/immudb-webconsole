import {
	SET_TOKEN,
} from './constants';

export default {
	[SET_TOKEN](state, payload) {
		state.token = payload;
	},
};
