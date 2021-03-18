import Vue from 'vue';
import {
	SOCKET_ONOPEN,
	SOCKET_ONCLOSE,
	SOCKET_ONERROR,
	SOCKET_ONMESSAGE,
	SOCKET_RECONNECT,
	SOCKET_RECONNECT_ERROR,
} from './constants';

export default {
	[SOCKET_ONOPEN](state, event) {
		Vue.prototype.$socket = event.currentTarget;
		state.socket.isConnected = true;
	},
	[SOCKET_ONCLOSE](state, event) {
		state.socket.isConnected = false;
	},
	[SOCKET_ONERROR](state, event) {
		console.error(state, event);
	},
	// default handler called for all methods
	[SOCKET_ONMESSAGE](state, message) {
		state.socket.message = message;
	},
	// mutations for reconnect methods
	[SOCKET_RECONNECT](state, count) {
		console.info(state, count);
	},
	[SOCKET_RECONNECT_ERROR](state) {
		state.socket.reconnectError = true;
	},
};
