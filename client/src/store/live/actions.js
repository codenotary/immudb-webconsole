import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	FETCH_LIVE,
	RUN_LIVE,
	SET_LIVE_ACTIVE,
	SET_COMMANDS,
} from './constants';

export default {
	[FETCH_LIVE]({ commit }, payload) {
		const LOADING_LABEL = 'fetchLive';
		try {
			const { live } = payload || {};
			if (live) {
				commit(SET_LIVE_ACTIVE, {
					active: live,
				});
				commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL }, { root: true });
				commit(SET_COMMANDS, {
					commands: {},
				});
			}
			else {
				commit(SET_LIVE_ACTIVE, {
					active: false,
				});
			}
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
	[RUN_LIVE]({ commit }, payload) {
		const LOADING_LABEL = 'runLive';
		try {
			if (payload) {
				commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL }, { root: true });
			}
		}
		catch (err) {
			try {
				console.error(err);
				commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			}
			catch (err2) {
				console.error(err2);
			}
			throw err;
		}
	},
	[SET_LIVE_ACTIVE]({ commit }, payload) {
		commit(SET_LIVE_ACTIVE, payload);
	},
	[SET_COMMANDS]({ commit }, payload) {
		commit(SET_COMMANDS, payload);
	},
};
