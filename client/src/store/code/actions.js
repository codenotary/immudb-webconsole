import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	TOPIC_MODULE,
	TOPICS,
} from '@/store/topic/constants';
import { StaticDataService } from '@/services';
import {
	FETCH_LANGUAGES,
	FETCH_CODES,
	FETCH_CODE,
	SET_LANGUAGES,
	SET_ACTIVE_LANGUAGE,
	SET_CODE,
	SET_ACTIVE_CODE,
	ACTIVE_LANGUAGE,
	LANGUAGES_PATH,
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
	async [FETCH_CODES]({ commit, rootState, getters }) {
		try {
			const { path, mime } = getters[ACTIVE_LANGUAGE];

			const getRequests = (data, parentId = null) => {
				if (data) {
					return data.reduce((acc, _, idx) => {
						const { id, children, fileName } = _;
						if (fileName) {
							let _url = fileName.startsWith('/') ? fileName : `/${ fileName }`;
							_url = _url.endsWith(`.${ mime }`) ? _url : `${ _url }.${ mime }`;
							acc = [...acc, {
								request: StaticDataService.get(`${ CODES_PATH }${ path }${ _url }`),
								id: `${ parentId !== null ? parentId + '.children.' : '' }${ id }`,
							}];
						}
						if (children) {
							acc = [...acc, ...getRequests(children, idx)];
						}
						return acc;
					}, []);
				}
			};

			const requests = getRequests(rootState[`${ TOPIC_MODULE }/${ TOPICS }`]);

			if (requests) {
				await Promise.all(
					requests.map(_ => _.request),
				)
						.then((response) => {
							response && response.map((_, idx) => {
								commit(SET_CODE, {
									id: requests[idx].id,
									code: _ && _.data,
								});
							});
						})
						.catch((e) => {
							console.error(e);
						})
						.finally(() => {
						});
			}
		}
		catch (err) {
			console.error(err);
		}
	},
	async [FETCH_CODE]({ commit, getters }, payload) {
		try {
			const { code } = payload || {};
			const { path, mime } = getters[ACTIVE_LANGUAGE];

			if (code) {
				let _url = code.startsWith('/') ? code : `/${ code }`;
				_url = _url.endsWith(`.${ mime }`) ? _url : `${ _url }.${ mime }`;

				await StaticDataService.get(`${ CODES_PATH }${ path }${ _url }`)
						.then((response) => {
							if (response) {
								const { data } = response;
								if (data) {
									commit(SET_ACTIVE_CODE, {
										code: data,
									});
								}
							}
						})
						.catch((e) => {
							console.error(e);
						})
						.finally(() => {
						});
			}
			else {
				commit(SET_ACTIVE_CODE, {
					code: undefined,
				});
			}
		}
		catch (err) {
			console.error(err);
		}
	},
	[SET_LANGUAGES]({ commit }, payload) {
		commit(SET_LANGUAGES, payload);
	},
	[SET_ACTIVE_LANGUAGE]({ commit }, payload) {
		commit(SET_ACTIVE_LANGUAGE, payload);
	},
	[SET_CODE]({ commit }, payload) {
		commit(SET_CODE, payload);
	},
	[SET_ACTIVE_CODE]({ commit }, payload) {
		commit(SET_ACTIVE_CODE, payload);
	},
};
