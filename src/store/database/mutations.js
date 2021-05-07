import {
	SET_DATABASE_LIST,
	SET_TABLE_LIST,
} from './constants';

export default {
	[SET_DATABASE_LIST](state, payload) {
		const { databases } = payload;
		databases && (state.databaseList = databases);
	},
	[SET_TABLE_LIST](state, payload) {
		const { tables } = payload;
		tables && (state.tableList = tables);
	},
};
