import { ImmudbService } from '@/services/immudb';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	FETCH_USER_LIST,
	SET_USER_LIST,
	ADD_USER,
	SET_ACTIVE_USER,
	UPDATE_PASSWORD,
	ADD_PERMISSION,
	UPDATE_PERMISSIONS,
} from './constants';

export default {
	async [FETCH_USER_LIST]({ commit }) {
		const LOADING_LABEL = 'fetchUserList';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			const response = await ImmudbService.userList();

			if (response && response.data) {
				commit(SET_USER_LIST, response.data);
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
	async [ADD_USER]({ commit }, payload) {
		const LOADING_LABEL = 'addUser';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			await ImmudbService.addUser(payload);

			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
			return false;
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
	async [SET_ACTIVE_USER]({ commit }, payload) {
		const LOADING_LABEL = 'setActiveUser';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			await ImmudbService.setActiveUser(payload);

			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
			return false;
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
	async [UPDATE_PASSWORD]({ commit }, payload) {
		const LOADING_LABEL = 'updatePassword';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			await ImmudbService.updatePassword(payload);

			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
			return false;
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
	async [ADD_PERMISSION]({ commit }, payload) {
		const LOADING_LABEL = 'addPermissions';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			await ImmudbService.addPermissions(payload);

			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
			return false;
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
	async [UPDATE_PERMISSIONS]({ commit }, payload) {
		const LOADING_LABEL = 'updatePermissions';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			await ImmudbService.updatePermissions(payload);

			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
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
