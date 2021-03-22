import { StaticDataService } from '@/services';
import {
	FETCH_GUIDE,
	SET_GUIDE,
	SET_ACTIVE_GUIDE,
	GUIDES_PATH,
} from './constants';

export default {
	async [FETCH_GUIDE]({ commit }, payload) {
		try {
			const { id, title, documentation } = payload;

			if (id) {
				let _url = id.startsWith('/') ? id : `/${ id }`;
				_url = _url.endsWith('.md') ? _url : `${ _url }.md`;

				await StaticDataService.get(`${ GUIDES_PATH }${ _url }`)
						.then((response) => {
							if (response) {
								const { data } = response;
								if (data) {
									commit(SET_ACTIVE_GUIDE, {
										title,
										documentation,
										markdown: data,
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
				commit(SET_ACTIVE_GUIDE, {
					title: null,
					documentation: null,
					markdown: null,
				});
			}
		}
		catch (err) {
			console.error(err);
		}
	},
	[SET_GUIDE]({ commit }, payload) {
		commit(SET_GUIDE, payload);
	},
	[SET_ACTIVE_GUIDE]({ commit }, payload) {
		commit(SET_ACTIVE_GUIDE, payload);
	},
};
