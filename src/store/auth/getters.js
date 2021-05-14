import {
	DEFAULT_DB,
} from '@/store/database/constants';
import {
	TOKEN,
	AUTHENTICATED,
	USER,
	USER_PERMISSION,
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
	[USER_PERMISSION]: state => (database) => {
		if (state.permissions) {
			return state.permissions.find((_) => {
				return _.database === (database || DEFAULT_DB);
			});
		}
		return { permission: 0 };
	},
};
