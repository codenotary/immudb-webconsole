import {
	TABLES,
} from './constants';

export default {
	[TABLES](state) {
		return state.tables || [];
	},
};
