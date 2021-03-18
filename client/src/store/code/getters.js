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
		let result = {};

		const recursiveGet = (data) => {
			data && data.map((_) => {
				const activePath = `/${ label }/${ _ && _.fileName }.${ mime }`;
				const { children } = _;
				const childSearch = children && recursiveGet(children);
				if (activePath === state.activeExample || childSearch) {
					if (_ && activePath === state.activeExample) {
						result = _;
					}
					else if (childSearch) {
						result = childSearch;
					}
				}
			});
		};

		recursiveGet(state.examples);
		return result;
	},
};