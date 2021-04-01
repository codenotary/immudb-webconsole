import Vue from 'vue';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	ContentService,
} from '@/services';
import {
	FETCH_TOPICS,
	SET_TOPICS,
	SET_ACTIVE_TOPIC,
} from './constants';

export default {
	async [FETCH_TOPICS]({ commit }) {
		const LOADING_LABEL = 'fetchExamples';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
			await ContentService.post('/guides', { deep: true })
					.then(async (response) => {
						if (response) {
							const topicsTree = await Vue.prototype.$workers
									.parseTopicsTree(response && response.data, 'guides');
							commit(SET_TOPICS, { topics: topicsTree });
						}
						commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					}, (err) => {
						console.error(err);
						commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
					})
					.finally(() => {
					});
		}
		catch (err) {
			console.error(err);
		}
		// try {
		// 	commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
		// 	return await StaticDataService.get(TOPICS_PATH)
		// 			.then((response) => {
		// 				commit(SET_TOPICS, response && response.data);
		// 				commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		// 			}, (err) => {
		// 				console.error(err);
		// 				commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		// 			})
		// 			.finally(() => {
		// 			});
		// }
		// catch (err) {
		// 	console.error(err);
		// 	commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		// }
	},
	[SET_TOPICS]({ commit }, payload) {
		commit(SET_TOPICS, payload);
	},
	[SET_ACTIVE_TOPIC]({ commit }, payload) {
		commit(SET_ACTIVE_TOPIC, payload);
	},
};
