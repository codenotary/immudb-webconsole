import { ApiService } from '@/services';
import { ImmudbService } from '@/services/immudb';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	LOGIN,
	SET_TOKEN,
	SET_USER,
} from './constants';

export default {
	async [LOGIN]({ commit }, data) {
		const LOADING_LABEL = 'login';
		try {
			if (data) {
				commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

				const { user, password } = data;

				const response = await ImmudbService.login({
					user: btoa(user),
					password: btoa(password),
				});

				if (response && response.data) {
					const { token } = response.data;
					if (token) {
						ApiService.defaults.headers.common = {
							Authorization: `Bearer ${ token }`,
						};

						commit(SET_TOKEN, token);
						commit(SET_USER, user);
					}
				}

				commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
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
	[SET_TOKEN]({ commit }, auth) {
		commit(SET_TOKEN, auth);
	},
	[SET_USER]({ commit }, auth) {
		commit(SET_USER, auth);
	},
};
