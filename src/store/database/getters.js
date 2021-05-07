import {
	DATABASE_LIST,
	TABLE_LIST,
} from './constants';

export default {
	[DATABASE_LIST](state) {
		return state.databaseList || [];
	},
	[TABLE_LIST](state) {
		return state.tableList || [];
	},
};
