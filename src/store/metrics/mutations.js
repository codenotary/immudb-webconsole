import Vue from 'vue';
import moment from 'moment';
import {
	SET_METRICS,
	MEMORY_RESERVED,
	MEMORY_IN_USE,
} from './constants';

const humanizeDuration = require('humanize-duration');
const shortEnglishHumanizer = humanizeDuration.humanizer({
	language: 'shortEn',
	languages: {
		shortEn: {
			y: () => 'y',
			mo: () => 'mo',
			w: () => 'w',
			d: () => 'd',
			h: () => 'h',
			m: () => 'm',
			s: () => 's',
			ms: () => 'ms',
		},
	},
	round: true,
	units: ['y', 'mo', 'w', 'd', 'h', 'm', 's'],
	largest: 4,
});

export default {
	[SET_METRICS](state, payload) {
		const {
			dbUptimeHours,
			dbEntries,
			dbSize,
			memSysBytes,
			heapInUseBytes,
			stackInUseBytes,
			// grpcServerHandlingSeconds,
		} = payload;

		// Uptime hours
		if (dbUptimeHours && dbUptimeHours[0] && dbUptimeHours[0].value) {
			const { metrics: { 0: { value } } } = dbUptimeHours[0];
			const _value = shortEnglishHumanizer(value * 3.6e+6);
			state.dbUptimeHours = {
				title: this.$i18n.t('metrics.dbUptimeHours.title'),
				value: _value.replace(/, /g, ' '),
			};
		}

		// Number of entris
		if (dbEntries && dbEntries[0] && dbEntries[0].value) {
			const { metrics: { 0: { value } } } = dbEntries[0];
			const _value = Number(value).toPrecision();
			state.dbEntries = {
				title: this.$i18n.t('metrics.dbEntries.title'),
				value: _value,
			};
		}

		// Database size
		if (dbSize) {
			const { help, metrics } = dbSize;
			const now = moment.now();
			Vue.set(state.dbSize, 'help', help);
			metrics
					.map((_) => {
						const { labels: { db }, value } = _;
						const _dbSize = Number(value).toPrecision();
						const idx = state.dbSize && state.dbSize.items &&
							state.dbSize.items.findIndex(_ => _ && _.db === db);
						const item = {
							y: parseInt(_dbSize) || 0,
							x: now,
						};
						if (idx >= 0) {
							Vue.set(state.dbSize.items[idx], 'values', [
								...state.dbSize.items[idx].values,
								item,
							]);
						}
						else {
							Vue.set(state.dbSize, 'items', [
								...(state.dbSize.items || []),
								{ db, values: [item] },
							]);
						}
					});
		}

		// Memory usage
		if (memSysBytes && heapInUseBytes && stackInUseBytes) {
			const { metrics: { 0: { value: memSysBytesValue } } } = memSysBytes;
			const { metrics: { 0: { value: heapInUseBytesValue } } } = heapInUseBytes;
			const { metrics: { 0: { value: stackInUseBytesValue } } } = stackInUseBytes;
			const now = moment.now();

			// RESERVED
			const _sysBytesValue = Number(memSysBytesValue).toPrecision();
			const itemReserved = {
				y: Number(_sysBytesValue),
				x: now,
			};
			if (state.memoryUsage && state.memoryUsage &&
				state.memoryUsage[MEMORY_RESERVED]) {
				Vue.set(state.memoryUsage, MEMORY_RESERVED, [
					...state.memoryUsage[MEMORY_RESERVED],
					itemReserved,
				]);
			}
			else {
				Vue.set(state.memoryUsage, MEMORY_RESERVED, [itemReserved]);
			}

			// IN USE
			const _heapInUseBytesValue = Number(heapInUseBytesValue).toPrecision();
			const _stackInUseBytesValue = Number(stackInUseBytesValue).toPrecision();
			const itemInUse = {
				y: Number(_heapInUseBytesValue) + Number(_stackInUseBytesValue),
				x: now,
			};
			if (state.memoryUsage && state.memoryUsage &&
				state.memoryUsage[MEMORY_IN_USE]) {
				Vue.set(state.memoryUsage, MEMORY_IN_USE, [
					...state.memoryUsage[MEMORY_IN_USE],
					itemInUse,
				]);
			}
			else {
				Vue.set(state.memoryUsage, MEMORY_IN_USE, [itemInUse]);
			}
		}
	},
};
