import {
	SET_LANGUAGES,
	SET_ACTIVE_LANGUAGE,
	SET_CODE,
	SET_ACTIVE_CODE,
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
	[SET_CODE](state, payload) {
		const { code } = payload;
		state.code = code;
	},
	[SET_ACTIVE_CODE](state, payload) {
		if (payload) {
			const { code } = payload;
			state.activeCode = code;
		}
	},
};
