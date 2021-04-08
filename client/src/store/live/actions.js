import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	OUTPUT_MODULE,
	IMMUDB,
	TOKEN,
} from '@/store/output/constants';
import { LiveService } from '@/services/live';
import {
	FETCH_LIVE,
	SET_LIVE_ACTIVE,
	SET_LIVE_PROMPT,
	SET_LIVE_INTRO,
	SET_CONTAINER_ID,
	STOP_LIVE,
} from './constants';

export default {
	async [FETCH_LIVE]({ commit, rootGetters }, payload) {
		const LOADING_LABEL = 'fetchLive';
		try {
			const immudb = rootGetters[`${ OUTPUT_MODULE }/${ IMMUDB }`];
			const token = rootGetters[`${ OUTPUT_MODULE }/${ TOKEN }`];

			// show live pane
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL }, { root: true });

			// fetch containerid (opening new container)
			await LiveService.startContainer({ immudb, token })
					.then((response) => {
						commit(SET_CONTAINER_ID, response && response.data);
						commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					}, (err) => {
						console.error(err);
						commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					});

			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
	[SET_LIVE_ACTIVE]({ commit }, payload) {
		commit(SET_LIVE_ACTIVE, payload);
	},
	[SET_LIVE_PROMPT]({ commit }, payload) {
		commit(SET_LIVE_PROMPT, payload);
	},
	[SET_LIVE_INTRO]({ commit }, payload) {
		commit(SET_LIVE_INTRO, payload);
	},
	[SET_CONTAINER_ID]({ commit }, payload) {
		commit(SET_CONTAINER_ID, payload);
	},
	async [STOP_LIVE]({ commit, state }) {
		const LOADING_LABEL = 'stopLive';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL }, { root: true });
			const id = state.containerId;

			if (id) {
				// stop container using containerid
				await LiveService.stopContainer(state.containerId)
						.then((_) => {
							commit(SET_CONTAINER_ID, null);
							commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
						}, (err) => {
							console.error(err);
							commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
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
};
