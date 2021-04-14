import { createStdout, createStderr, createDummyStdout } from 'vue-command';
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
import parseAnsi from '@/helpers/parseAnsi';
import {
	FETCH_LIVE,
	SET_LIVE_ACTIVE,
	SET_IN_PROGRESS,
	SET_PROMPT,
	SET_HISTORY,
	SET_EXECUTED,
	SET_POINTER,
	SET_TERM_STDIN,
	SET_INTRO,
	SET_CONTAINER_ID,
	CLEAR_OUTPUT,
	APPEND_DUMMY_OUTPUT,
	APPEND_OUTPUT,
	APPEND_EXECUTED,
	STOP_LIVE,
	SET_COMMAND,
} from './constants';

export default {
	async [FETCH_LIVE]({ commit, rootGetters }) {
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
	[SET_IN_PROGRESS]({ commit }, payload) {
		commit(SET_IN_PROGRESS, payload);
	},
	[SET_PROMPT]({ commit }, payload) {
		commit(SET_PROMPT, payload);
	},
	[CLEAR_OUTPUT]({ commit }) {
		commit(SET_IN_PROGRESS, true);
		commit(SET_TERM_STDIN, '');
		commit(SET_HISTORY, [createDummyStdout()]);
		commit(SET_IN_PROGRESS, false);
	},
	[APPEND_DUMMY_OUTPUT]({ commit }) {
		try {
			commit(SET_IN_PROGRESS, true);
			commit(APPEND_OUTPUT, createDummyStdout());
			commit(SET_IN_PROGRESS, false);
		}
		catch (err) {
			console.error(err);
		}
	},
	[APPEND_OUTPUT]({ commit, state }, payload) {
		try {
			if (payload) {
				commit(SET_IN_PROGRESS, true);
				const { line, flux, append } = payload;
				commit(APPEND_OUTPUT, flux === 'stderr'
					? createStderr(parseAnsi(line), false, append)
					: createStdout(parseAnsi(line), false, false, append),
				);
				commit(SET_POINTER, state.pointer + 1);
				commit(SET_IN_PROGRESS, false);
			}
		}
		catch (err) {
			console.error(err);
		}
	},
	[APPEND_EXECUTED]({ commit }, payload) {
		commit(APPEND_EXECUTED, payload);
	},
	[SET_HISTORY]({ commit }, payload) {
		commit(SET_HISTORY, payload);
	},
	[SET_EXECUTED]({ commit }, payload) {
		commit(SET_EXECUTED, payload);
	},
	[SET_POINTER]({ commit }, payload) {
		commit(SET_POINTER, payload);
	},
	[SET_TERM_STDIN]({ commit }, payload) {
		commit(SET_TERM_STDIN, payload);
	},
	[SET_INTRO]({ commit }, payload) {
		commit(SET_INTRO, payload);
	},
	[SET_CONTAINER_ID]({ commit }, payload) {
		commit(SET_CONTAINER_ID, payload);
	},
	[SET_COMMAND]({ commit }, payload) {
		commit(SET_COMMAND, payload);
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
