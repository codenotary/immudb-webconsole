import Vue from 'vue';
import {
	SET_LANGUAGES,
	SET_ACTIVE_LANGUAGE,
	SET_CODE,
} from './constants';
const objectPath = require('object-path');

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
		const { id, code } = payload;
		// next step is mandatory to force reactivity
		const examples = state.examples;
		objectPath.set(examples, `${ id }.code`, code);
		Vue.set(state, examples, examples);
	},
};
