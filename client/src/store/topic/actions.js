import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import { StaticDataService } from '@/services';
import {
	FETCH_TOPICS,
	SET_TOPICS,
	SET_ACTIVE_TOPIC,
	TOPICS_PATH,
} from './constants';

export default {
	async [FETCH_TOPICS]({ commit }, payload) {
		const LOADING_LABEL = 'fetchExamples';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });
			await StaticDataService.get(TOPICS_PATH)
					.then((response) => {
						commit(SET_TOPICS, response && response.data);
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
	[SET_TOPICS]({ commit }, payload) {
		commit(SET_TOPICS, payload);
	},
	[SET_ACTIVE_TOPIC]({ commit }, payload) {
		commit(SET_ACTIVE_TOPIC, payload);
	},
};
