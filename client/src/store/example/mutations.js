import {
	SET_LANGUAGES,
	SET_ACTIVE_LANGUAGE,
	SET_EXAMPLES,
	SET_CODES,
	SET_ACTIVE_EXAMPLE,
} from './constants';

export default {
	[SET_LANGUAGES](state, payload) {
		const { languages } = payload;
		languages && (state.languages = languages);
	},
	[SET_ACTIVE_LANGUAGE](state, payload) {
		const { language } = payload;
		language && (state.activeLanguage = language);
	},
	[SET_EXAMPLES](state, payload) {
		const { examples } = payload;
		examples && (state.examples = examples.map((_, idx) => {
			const _e = _;
			_e.id = idx;
			return _e;
		}));
	},
	[SET_CODES](state, payload) {
		const { codes } = payload;
		codes && (state.examples = state.examples.map((_, idx) => {
			const _e = _;
			_e.code = codes[idx];
			return _e;
		}));
	},
	[SET_ACTIVE_EXAMPLE](state, payload) {
		const { activePath } = payload;
		activePath && (state.activeExample = activePath);
	},
};
