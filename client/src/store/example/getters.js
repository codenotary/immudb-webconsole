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
	[ACTIVE_EXAMPLE](state, getters) {
		const { label, mime } = getters[ACTIVE_LANGUAGE];
		return state.examples.find((_) => {
			const activePath = `/${ label }/${ _ && _.fileName }.${ mime }`;
			return activePath === state.activeExample;
		}) || {};
	},
};
