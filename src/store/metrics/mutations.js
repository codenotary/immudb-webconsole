import moment from 'moment';
import {
	SET_METRICS,
} from './constants';

export default {
	[SET_METRICS](state, payload) {
		const { dbSize, memoryUsage, readAndWrite } = payload;
		// dbSize
		if (dbSize) {
			const { help, metrics } = dbSize;
			const now = moment.now();
			state.dbSize.title = help;
			metrics
					.map((_) => {
						const { labels: { db }, value } = _;
						const idx = state.dbSize && state.dbSize.items &&
							state.dbSize.items.findIndex(_ => _ && _.db === db);
						const item = { y: parseInt(value) || 0, x: now };
						if (idx >= 0) {
							state.dbSize.items[idx].values = [
								...state.dbSize.items[idx].values,
								item,
							];
						}
						else {
							state.dbSize.items = [
								...(state.dbSize.items || []),
								{ db, values: [item] },
							];
						}
					});
		}
		memoryUsage && (state.memoryUsage = memoryUsage);
		readAndWrite && (state.readAndWrite = readAndWrite);
	},
};
