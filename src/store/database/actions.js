import { ImmudbService } from '@/services/immudb';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	FETCH_TABLES,
	SET_TABLES,
} from './constants';

export default {
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
									ImmudbService.tableDescribe({ tableName: _ && _.value }),
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
	[SET_TABLES]({ commit }, payload) {
		commit(SET_TABLES, payload);
	},
};
