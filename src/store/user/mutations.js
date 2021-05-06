import {
	SET_USER_LIST,
} from './constants';

export default {
	[SET_USER_LIST](state, payload) {
		state.userList = payload;
	},
};
