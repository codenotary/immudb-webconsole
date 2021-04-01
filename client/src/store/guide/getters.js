import {
	GUIDES,
	ACTIVE_GUIDE,
} from './constants';

export default {
	[GUIDES](state) {
		return state.guides || [];
	},
	[ACTIVE_GUIDE](state) {
		return state.activeGuide || {};
	},
};
