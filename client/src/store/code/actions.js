import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view';
import {
	RUN_CODE,
	APPEND_CODE_HISTORY,
	SET_IMMUDB,
	SET_MERKLE_TREE,
	SET_CODE_OUTPUT,
} from './constants';
import { CodeService } from '~/services/code';

export default {
	async [RUN_CODE]({ commit }, payload) {
		const LOADING_LABEL = 'runCode';
		try {
			if (payload) {
				commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL }, { root: true });

				const { code, immudb } = payload;

				if (code) {
					commit(APPEND_CODE_HISTORY, {
						//
					});

					const params = {
						code,
						immudb: immudb || '',
					};

					const { data } = await CodeService.runCode(params);

					commit(SET_IMMUDB, {
						immudb: data && data.immudb,
					});

					commit(SET_MERKLE_TREE, {
						merkleTree: data && data.tree,
					});

					commit(SET_CODE_OUTPUT, {
						stderr: data && data.stderr,
						stdout: data && data.stdout,
					});

					commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });

					return data;
				}
			}
			else {
				console.log('a payload is needed to run code');
			}
		}
		catch (err) {
			console.error(err);
			commit(`${ VIEW_MODULE }/${ POP_LOADING }`, { label: LOADING_LABEL }, { root: true });
			throw err;
		}
	},
};
