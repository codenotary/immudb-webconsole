import {
	LANGUAGES,
	ACTIVE_LANGUAGE,
	EXAMPLES,
	ACTIVE_EXAMPLE,
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
	[EXAMPLES](state) {
		return state.examples || [];
	},
	[ACTIVE_EXAMPLE](state) {
		return state.examples.find((_) => {
			return _ && `/${ state.activeLanguage }/${ _.fileName }` === state.activeExample;
		}) || {};
	},
};
