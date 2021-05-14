import {
	SET_METRICS,
} from './constants';

export default {
	[SET_METRICS](state, payload) {
		const { metrics } = payload;
		metrics && (state.metrics = metrics);
	},
};
