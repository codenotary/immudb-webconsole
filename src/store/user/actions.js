import { ImmudbService } from '@/services/immudb';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	FETCH_USER_LIST,
	SET_USER_LIST,
} from './constants';

export default {
	async [FETCH_USER_LIST]({ commit }) {
		const LOADING_LABEL = 'fetchUserList';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			const response = await ImmudbService.userList();

			if (response && response.data) {
				commit(SET_USER_LIST, response.data.users);
				commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			}

			return false;
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
	[SET_USER_LIST]({ commit }, payload) {
		commit(SET_USER_LIST, payload);
	},
};
