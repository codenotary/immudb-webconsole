import {
	HEALTH,
	STATE,
	TABLES,
	TX,
	TX_PRESENT,
} from './constants';

export default {
	[HEALTH](state) {
		return state.health;
	},
	[STATE](state) {
		return state.state;
	},
	[TABLES](state) {
		return state.tables || [];
	},
	[TX](state) {
		return state.state.txId || '1';
	},
	[TX_PRESENT](state) {
		return state.state.txPresent || '1';
	},
};
