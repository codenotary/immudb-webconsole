import {
	METRICS,
} from './constants';

export default {
	[METRICS](state) {
		return state.metrics || [];
	},
};
