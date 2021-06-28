import Vue from 'vue';
import {
	SET_TOKEN,
	SET_USER,
	SET_USER_PERMISSION,
} from './constants';

export default {
	[SET_TOKEN](state, payload) {
		Vue.set(state, 'token', payload);
	},
	[SET_USER](state, payload) {
		state.user = payload;
	},
	[SET_USER_PERMISSION](state, payload) {
		try {
			if (payload) {
				const { users } = payload;
				const current = users && users.filter(_ => _.user === state.user)[0];
				if (current && current.permissions) {
					let permissions = [];
					current && current.permissions
							.map((_) => {
								const { database, permission } = _;
								permissions = [...permissions, {
									database,
									permission,
								}];
							});
					Vue.set(state, 'permissions', permissions);
				}
			}
			else {
				Vue.set(state, 'permissions', []);
			}
		}
		catch (err) {
			console.error(err);
		}
	},
};
