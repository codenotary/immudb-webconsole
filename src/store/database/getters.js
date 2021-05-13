import {
	ACTIVE_DATABASE,
	DATABASE_LIST,
	TABLE_LIST,
	DEFAULT_DATABASE,
} from './constants';

export default {
	[ACTIVE_DATABASE](state) {
		return state.active || DEFAULT_DATABASE;
	},
	[DATABASE_LIST](state) {
		return state.databaseList || [];
	},
	[TABLE_LIST](state) {
		return state.tableList || [];
	},
};
