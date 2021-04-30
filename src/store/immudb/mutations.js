import {
	SET_TOKEN,
	SET_HEALTH,
	SET_STATE,
	SET_TABLES,
	SET_TX,
} from './constants';

export default {
	[SET_TOKEN](state, payload) {
		state.token = payload;
	},
	[SET_HEALTH](state, payload) {
		state.health = payload;
	},
	[SET_TABLES](state, payload) {
		const { tables } = payload;
		tables && (state.tables = tables);
	},
	[SET_STATE](state, payload) {
		if (payload) {
			const { db, txId, txHash } = payload;
			db && (state.state.db = db);
			txId && (state.state.txId = txId);
			txId && (state.state.txPresent = txId);
			txHash && (state.state.txHash = txHash);
		}
	},
	[SET_TX](state, payload) {
		state.state.txId = payload;
	},
};
