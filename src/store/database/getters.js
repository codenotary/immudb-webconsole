import {
	ACTIVE_DATABASE,
	DATABASE_LIST,
	TABLE_LIST,
} from './constants';

export default {
	[ACTIVE_DATABASE](state) {
		return state.active || 'defaultdb';
	},
	[DATABASE_LIST](state) {
		return state.databaseList || [];
	},
	[TABLE_LIST](state) {
		return state.tableList || [];
	},
};
