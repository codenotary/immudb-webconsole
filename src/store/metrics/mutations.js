import Vue from 'vue';
import moment from 'moment';
import {
	SET_METRICS,
} from './constants';

export default {
	[SET_METRICS](state, payload) {
		const {
			dbSize,
			memSysBytes,
			heapInUseBytes,
			stackInUseBytes,
			// handlingSeconds,
		} = payload;

		// Database size
		if (dbSize) {
			const { help, metrics } = dbSize;
			const now = moment.now();
			Vue.set(state.dbSize, 'help', help);
			metrics
					.map((_) => {
						const { labels: { db }, value } = _;
						const idx = state.dbSize && state.dbSize.items &&
							state.dbSize.items.findIndex(_ => _ && _.db === db);
						const item = { y: parseInt(value) || 0, x: now };
						if (idx >= 0) {
							const _values = [
								...state.dbSize.items[idx].values,
								item,
							];
							Vue.set(state.dbSize.items[idx], 'values', _values);
						}
						else {
							const _values = [
								...(state.dbSize.items || []),
								{ db, values: [item] },
							];
							Vue.set(state.dbSize, 'items', _values);
						}
					});
		}

		// Memory usage
		if (memSysBytes && heapInUseBytes && stackInUseBytes) {
			// console.log(memSysBytes, heapInUseBytes, stackInUseBytes);
			// const { help, metrics } = dbSize;
			// const now = moment.now();
			// Vue.set(state.dbSize, 'help', help);
			// metrics
			// 		.map((_) => {
			// 			const { labels: { db }, value } = _;
			// 			const idx = state.dbSize && state.dbSize.items &&
			// 				state.dbSize.items.findIndex(_ => _ && _.db === db);
			// 			const item = { y: parseInt(value) || 0, x: now };
			// 			if (idx >= 0) {
			// 				const _values = [
			// 					...state.dbSize.items[idx].values,
			// 					item,
			// 				];
			// 				Vue.set(state.dbSize.items[idx], 'values', _values);
			// 			}
			// 			else {
			// 				// state.dbSize.items = [
			// 				// 	...(state.dbSize.items || []),
			// 				// 	{ db, values: [item] },
			// 				// ];
			// 				const _values = [
			// 					...(state.dbSize.items || []),
			// 					{ db, values: [item] },
			// 				];
			// 				Vue.set(state.dbSize, 'items', _values);
			// 			}
			// 		});
		}
	},
};
