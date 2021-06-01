import { ImmudbService } from '@/services/immudb';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	OUTPUT_MODULE,
	APPEND_CODE_OUTPUT,
} from '@/store/output/constants';
import {
	IMMUDB_MODULE,
	FETCH_HEALTH,
	FETCH_STATE,
	SET_STATE,
	SET_HEALTH,
	RUN_SQL_EXEC,
	RUN_SQL_QUERY,
	SET_TX,
	TX,
	TX_PRESENT,
} from './constants';

export default {
	async [FETCH_HEALTH]({ commit }, auth) {
		const response = await ImmudbService.health();

		commit(SET_HEALTH, response && response.data);
	},
	async [FETCH_STATE]({ commit }, auth) {
		const response = await ImmudbService.state();

		commit(SET_STATE, response && response.data);
	},
	async [RUN_SQL_EXEC]({ commit }, payload) {
		const LOADING_LABEL = 'runSqlExec';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			let sql = payload;
			sql = sql && sql.endsWith(';')
				? sql
				: `${ sql };`;

			await ImmudbService.sqlExec({
				sql: sql.replace(/"/g, '\''),
			})
					.then((response) => {
						// console.log(response && response.data);
					})
					.catch((err) => {
						console.error(err);
						throw err;
					});
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
	async [RUN_SQL_QUERY]({ commit, rootGetters }, payload) {
		const LOADING_LABEL = 'runSqlQuery';
		const tx = rootGetters[`${ IMMUDB_MODULE }/${ TX }`];
		const txPresent = rootGetters[`${ IMMUDB_MODULE }/${ TX_PRESENT }`];

		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			let sql = payload;
			sql = sql.endsWith(';') ? sql : `${ sql };`;
			await ImmudbService.sqlQuery({
				sql: sql.replace(/"/g, '\''),
			})
					.then((response) => {
						if (response && response.data) {
							commit(`${ OUTPUT_MODULE }/${ APPEND_CODE_OUTPUT }`, {
								output: {
									...response.data || {},
									flux: 'stdtable',
									tx,
									timeTravel: tx !== txPresent,
								},
							}, { root: true });
						}
					})
					.catch((err) => {
						console.error(err);
						throw err;
					});
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		}
		catch (err) {
			const { response: { data } } = err;
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			commit(`${ OUTPUT_MODULE }/${ APPEND_CODE_OUTPUT }`, {
				output: {
					timestamp: data.timestamp || undefined,
					line: data.message || '',
					flux: 'stderr',
					tx,
					timeTravel: tx !== txPresent,
				},
			}, { root: true });
			throw err;
		}
	},
	[SET_STATE]({ commit }, payload) {
		commit(SET_STATE, payload);
	},
	[SET_TX]({ commit }, payload) {
		commit(SET_TX, payload);
	},
};
