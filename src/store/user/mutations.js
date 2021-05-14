import {
	SET_USER_LIST,
} from './constants';

export default {
	[SET_USER_LIST](state, payload) {
		const { users } = payload;
		users && (state.userList = users)
				.map((_) => {
					const u = _;
					u.user = atob(u.user);
					return u;
				});
	},
};
