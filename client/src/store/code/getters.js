import {
	LANGUAGES,
	ACTIVE_LANGUAGE,
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
};
