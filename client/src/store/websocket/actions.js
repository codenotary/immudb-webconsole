import Vue from 'vue';
import {
	SOCKET_MESSAGE,
	SOCKET_OBJ_MESSAGE,
} from './constants';

export default {
	[SOCKET_MESSAGE](_, payload) {
		try {
			Vue.prototype.$socket.send(payload);
		}
		catch (err) {
			console.error(err);
		}
	},
	[SOCKET_OBJ_MESSAGE](_, payload) {
		try {
			Vue.prototype.$socket.sendObj(payload);
		}
		catch (err) {
			console.error(err);
		}
	},
};
