import {
	SET_HEALTH,
	SET_STATE,
	SET_TX,
} from './constants';

export default {
	[SET_HEALTH](state, payload) {
		state.health = payload;
	},
	[SET_STATE](state, payload) {
		if (payload) {
			const { db, txId, txHash } = payload || {};
			db && (state.state.db = db);
			txHash && (state.state.txHash = txHash);
			if (txId) {
				txId && (state.state.txId = txId);
				txId && (state.state.txPresent = txId);
			}
			else {
				state.state.txId = 0;
				state.state.txPresent = 0;
			}
		}
		else {
			state.state = undefined;
		}
	},
	[SET_TX](state, payload) {
		state.state.txId = payload;
	},
};
