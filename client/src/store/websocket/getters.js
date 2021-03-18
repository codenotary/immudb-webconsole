import {
	SOCKET_IS_CONNECTED,
	SOCKET_MESSAGE,
} from './constants';

export default {
	[SOCKET_IS_CONNECTED](state) {
		return state.isConnected;
	},
	[SOCKET_MESSAGE](state) {
		return state.message;
	},
};
