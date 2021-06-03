import { TokenService } from '@/services/token';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	FETCH_DOCKER_TOKEN,
	SET_DOCKER_TOKEN,
} from './constants';

export default {
	async [FETCH_DOCKER_TOKEN]({ commit }) {
		const LOADING_LABEL = 'fetchDockerToken';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			const response = await TokenService.token();

			if (response && response.data) {
				const { token } = response.data;

				commit(SET_DOCKER_TOKEN, token);
				commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			}

			return false;
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
	[SET_DOCKER_TOKEN]({ commit }) {
		commit(SET_DOCKER_TOKEN);
	},
};