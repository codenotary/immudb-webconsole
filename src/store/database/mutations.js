import {
	SET_TABLES,
} from './constants';

export default {
	[SET_TABLES](state, payload) {
		const { tables } = payload;
		tables && (state.tables = tables);
	},
};
