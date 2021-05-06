import {
	HEALTH,
	STATE,
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
	[TX](state) {
		return state.state.txId || '1';
	},
	[TX_PRESENT](state) {
		return state.state.txPresent || '1';
	},
};
