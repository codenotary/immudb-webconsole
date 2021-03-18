import Vue from 'vue';
import {
	SOCKET_MESSAGE,
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
};
