import { ApiService } from '@/services';
import { ImmudbService } from '@/services/immudb';
import {
	mdiShieldLock,
} from '@mdi/js';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
	SET_BANNER,
} from '@/store/view/constants';
import {
	LOGIN,
	SET_TOKEN,
	SET_USER,
	SET_USER_PERMISSION,
} from './constants';

export default {
	async [LOGIN]({ commit }, payload) {
		const LOADING_LABEL = 'login';
		try {
			if (payload) {
				commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

				const { user, password } = payload;

				const response = await ImmudbService.login({
					user: btoa(user),
					password: btoa(password),
				});

				if (response && response.data) {
					const { token, warning } = response.data;
					if (token) {
						ApiService.defaults.headers.common
								.Authorization = `Bearer ${ token }`;

						commit(SET_TOKEN, token);
						commit(SET_USER, user);

						if (warning) {
							commit(`${ VIEW_MODULE }/${ SET_BANNER }`, {
								show: true,
								title: atob(warning),
								color: 'primary',
								persistent: true,
								icon: mdiShieldLock,
							}, { root: true });
						}
						else {
							commit(`${ VIEW_MODULE }/${ SET_BANNER }`, null, { root: true });
						}
					}

					commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
				}
				else {
					const err = 'login received no response';
					commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					commit(SET_TOKEN, null);
					commit(SET_USER, null);
					throw err;
				}
			}
			return false;
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			commit(SET_TOKEN, null);
			commit(SET_USER, null);
			throw err;
		}
	},
	[SET_TOKEN]({ commit }, payload) {
		commit(SET_TOKEN, payload);
	},
	[SET_USER]({ commit }, payload) {
		commit(SET_USER, payload);
	},
	[SET_USER_PERMISSION]({ commit }, payload) {
		commit(SET_USER_PERMISSION, payload);
	},
};
