import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import storeWebsocket from '@/store/websocket';
import {
	WEBSOCKET_MODULE,
	// MESSAGE_TYPES,
	SOCKET_MESSAGE,
} from '@/store/websocket/constants';
// import {
// 	VIEW_MODULE,
// 	SET_FREEZE,
// 	SET_FREEZE_MODAL,
// 	FREEZE_TYPES,
// } from '@/store/view/constants';
// import {
// 	MAINTENANCE_MODULE,
// 	FETCH_BACKUP_LIST,
// } from '@/store/maintenance/constants';

export default ({ store }) => {
	const HOST = document.location.host;
	const PROTOCOL = location.protocol === 'https:' ? 'wss://' : 'ws://';
	const WEBSOCKET_URL = `${ PROTOCOL }${ HOST }${ process.env.WEBSOCKET_URL }/backup/notifications`;

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

				// // updated freeze status
				// if (type === MESSAGE_TYPES.BACKUP && !data) {
				// 	store.dispatch(`${ VIEW_MODULE }/${ SET_FREEZE }`, '');
				// 	store.dispatch(`${ VIEW_MODULE }/${ SET_FREEZE_MODAL }`, null);
				// }
				// else if (type === MESSAGE_TYPES.BACKUP) {
				// 	if (data) {
				// 		if (data.completed) {
				// 			// close the freeze modal after 3s to be sure
				// 			// the user could read it before auto-closing it
				// 			setTimeout(() => {
				// 				store.dispatch(`${ VIEW_MODULE }/${ SET_FREEZE }`, '');
				// 			}, 3000);
				// 			store.dispatch(`${ MAINTENANCE_MODULE }/${ FETCH_BACKUP_LIST }`);
				// 		}
				// 		else {
				// 			store.dispatch(`${ VIEW_MODULE }/${ SET_FREEZE }`, FREEZE_TYPES.BACKUP);
				// 		}

				// 		store.dispatch(`${ VIEW_MODULE }/${ SET_FREEZE_MODAL }`, {
				// 			name: data?.name,
				// 			progress: data?.progress,
				// 			phase: data?.phase,
				// 			err: data?.err,
				// 		});
				// 	}
				// }

				// send back an ack-like message to the WS
				store.dispatch(`${ WEBSOCKET_MODULE }/${ SOCKET_MESSAGE }`, { type });
			}
		},
	});
};
