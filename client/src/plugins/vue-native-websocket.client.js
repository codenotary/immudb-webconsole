import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import storeWebsocket from '@/store/websocket';
import {
	WEBSOCKET_MODULE,
	SOCKET_MESSAGE,
} from '@/store/websocket/constants';

export default ({ store }) => {
	const HOST = document.location.host;
	const PROTOCOL = location.protocol === 'https:' ? 'wss://' : 'ws://';
	const WEBSOCKET_URL = `${ PROTOCOL }${ HOST }${ process.env.WEBSOCKET_URL }`;

	console.log(`Connecting to WS throught ${ WEBSOCKET_URL }`);

	Vue.use(VueNativeSock, WEBSOCKET_URL, {
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 3000,
		format: 'json',
		store: storeWebsocket,
		passToStoreHandler: (eventName, event) => {
			if (!eventName.startsWith('SOCKET_')) {
				return;
			}
			let method = 'commit';
			let target = eventName.toUpperCase();
			let msg = event;
			if (event.data) {
				msg = JSON.parse(event.data);
				if (msg.mutation) {
					target = [msg.namespace || '', msg.mutation].filter(e => !!e).join('/');
				}
				else if (msg.action) {
					method = 'dispatch';
					target = [msg.namespace || '', msg.action].filter(e => !!e).join('/');
				}
			}

			// update websocket store
			store[method](`${ WEBSOCKET_MODULE }/${ target }`, msg);

			if (msg) {
				const { type, data } = msg;
				console.log('Websocket msg:', type, data);
				// send back an ack-like message to the WS
				store.dispatch(`${ WEBSOCKET_MODULE }/${ SOCKET_MESSAGE }`, { type });
			}
		},
	});
};
