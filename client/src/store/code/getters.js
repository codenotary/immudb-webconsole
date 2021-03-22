import {
	LANGUAGES,
	ACTIVE_LANGUAGE,
	CODES,
	ACTIVE_CODE,
} from './constants';

export default {
	[LANGUAGES](state) {
		return state.languages || [];
	},
	[ACTIVE_LANGUAGE](state) {
		return state.languages.find((_) => {
			return _ && _.label === state.activeLanguage;
		}) || {};
	},
	[CODES](state) {
		return state.codes || [];
	},
	[ACTIVE_CODE](state) {
		return state.activeCode || '';
	},
};
