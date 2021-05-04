import { ApiService } from '@/services/index';
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
	LOGIN,
	SET_TOKEN,
	FETCH_HEALTH,
	FETCH_STATE,
	SET_STATE,
	SET_HEALTH,
	FETCH_TABLES,
	RUN_SQL_EXEC,
	RUN_SQL_QUERY,
	SET_TABLES,
	SET_TX,
	IMMUDB_MODULE,
	TX,
	TX_PRESENT,
} from './constants';
const escape = require('sql-escape');

export default {
	[SET_TOKEN]({ commit }, auth) {
		commit(SET_TOKEN, auth);
	},
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
					}
				}

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
	async [FETCH_HEALTH]({ commit }, auth) {
		const response = await ImmudbService.health();

		commit(SET_HEALTH, response && response.data);
	},
	async [FETCH_STATE]({ commit }, auth) {
		const response = await ImmudbService.state();

		commit(SET_STATE, response && response.data);
	},
	async [FETCH_TABLES]({ commit }, payload) {
		const LOADING_LABEL = 'fetchTables';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			await ImmudbService.tableList()
					.then(async (response) => {
						if (response) {
							const { data: { rows } } = response;
							let tables = [];

							if (rows && rows.length) {
								tables = rows.reduce((acc, { values }) => {
									return [...acc, {
										label: values[0].s,
										value: values[0].s,
										type: 'tab',
									}];
								}, []);
								const responseList = await Promise.all(tables.map(_ =>
									ImmudbService.tableDescrive({ tableName: _ && _.value }),
								));

								if (responseList && responseList.length) {
									responseList.map((_, idx) => {
										const { data: { rows: cols } } = _;
										if (cols && cols.length) {
											tables[idx].children = cols.map((row) => {
												if (row) {
													return {
														label: row.values[0] && row.values[0].s,
														value: row.values[0] && row.values[0].s,
														tags: row.values[1] && row.values[1].s,
														primary: row.values[2] && row.values[2].s === 'PRIMARY KEY',
														foreignKey: row.values[2] && row.values[2].s === 'FOREIGN KEY',
														type: 'col',
													};
												}
												return {};
											});
										}
									});
								}
							}

							commit(SET_TABLES, {
								tables,
							});
						}
					})
					.catch((err) => {
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
	async [RUN_SQL_EXEC]({ commit }, payload) {
		const LOADING_LABEL = 'runSqlExec';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			let sql = payload;
			sql = sql.endsWith(';') ? sql : `${ sql };`;
			// sql = escape(sql);

			await ImmudbService.sqlExec({
				sql,
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
			sql = escape(sql);

			await ImmudbService.sqlQuery({
				sql,
			})
					.then((response) => {
						if (response) {
							const { data } = response;
							commit(`${ OUTPUT_MODULE }/${ APPEND_CODE_OUTPUT }`, {
								output: {
									...data || {},
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
	[SET_TABLES]({ commit }, payload) {
		commit(SET_TABLES, payload);
	},
	[SET_STATE]({ commit }, payload) {
		commit(SET_STATE, payload);
	},
	[SET_TX]({ commit }, payload) {
		commit(SET_TX, payload);
	},
};
