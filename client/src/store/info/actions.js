import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view';
import {
	FETCH_INFO,
	SET_INFO,
} from './constants';
import { InfoService } from '~/services/info';

export default {
	async [FETCH_INFO]({ commit }) {
		const LOADING_LABEL = 'runCode';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL }, { root: true });

			const { data } = await InfoService.fetchInfo();

			commit(SET_INFO, {
				version: data && data.version,
			});

			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
};
