import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import { StaticDataService } from '@/services';
import {
	FETCH_LANGUAGES,
	FETCH_EXAMPLES,
	FETCH_CODES,
	SET_LANGUAGES,
	SET_ACTIVE_LANGUAGE,
	SET_EXAMPLES,
	SET_CODES,
	SET_ACTIVE_EXAMPLE,
	ACTIVE_LANGUAGE,
	LANGUAGES_PATH,
	EXAMPLES_PATH,
	CODES_PATH,
} from './constants';

export default {
	async [FETCH_LANGUAGES]({ commit }, payload) {
		const LOADING_LABEL = 'fetchLanguages';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
			await StaticDataService.get(LANGUAGES_PATH)
					.then((response) => {
						commit(SET_LANGUAGES, response && response.data);
						commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					}, (err) => {
						console.error(err);
						commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					});
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		}
	},
	async [FETCH_EXAMPLES]({ commit }, payload) {
		const LOADING_LABEL = 'fetchExamples';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
			await StaticDataService.get(EXAMPLES_PATH)
					.then((response) => {
						commit(SET_EXAMPLES, response && response.data);
						commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					}, (err) => {
						console.error(err);
						commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					});
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		}
	},
	async [FETCH_CODES]({ commit, state, getters }, payload) {
		const LOADING_LABEL = 'fetchExamplesForLanguage';
		try {
			const { path, mime } = getters[ACTIVE_LANGUAGE];
			const requests = [];
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			await state.examples.map((_, idx) => {
				let _url = _.fileName.startsWith('/') ? _.fileName : `/${ _.fileName }`;
				_url = _url.endsWith(`.${ mime }`) ? _url : `${ _url }.${ mime }`;
				requests.push(StaticDataService.get(`${ CODES_PATH }${ path }${ _url }`));
			});
			Promise.all(requests)
					.then((response) => {
						commit(SET_CODES, { codes: response && response.map(_ => _.data) });
					})
					.catch((e) => {
						console.error(e);
					})
					.finally(() => {
						commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					});
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		}
	},
	[SET_LANGUAGES]({ commit }, payload) {
		commit(SET_LANGUAGES, payload);
	},
	[SET_ACTIVE_LANGUAGE]({ commit }, payload) {
		commit(SET_ACTIVE_LANGUAGE, payload);
	},
	[SET_EXAMPLES]({ commit }, payload) {
		commit(SET_EXAMPLES, payload);
	},
	[SET_CODES]({ commit }, payload) {
		commit(SET_CODES, payload);
	},
	[SET_ACTIVE_EXAMPLE]({ commit }, payload) {
		commit(SET_ACTIVE_EXAMPLE, payload);
	},
};
