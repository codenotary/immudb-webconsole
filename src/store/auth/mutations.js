import Vue from 'vue';
import {
	DEFAULT_DB,
} from '@/store/database/constants';
import {
	SET_TOKEN,
	SET_USER,
	SET_USER_PERMISSION,
} from './constants';

export default {
	[SET_TOKEN](state, payload) {
		state.token = payload;
	},
	[SET_USER](state, payload) {
		state.user = payload;
	},
	[SET_USER_PERMISSION](state, payload) {
		try {
			if (payload) {
				const { users } = payload;
				const current = users.filter(_ => _.user === state.user)[0];
				if (current && current.permissions) {
					let permissions = [];
					current && current.permissions
							.map((_) => {
								const { database, permission } = _;
								permissions = [...permissions, {
									database: database === '*'
										? DEFAULT_DB
										: database,
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
