import decompress from '@/helpers/decompress';
import { CodeService } from '@/services/code';
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

					if (data) {
						const { immudb, tree, stdout, stderr } = data;

						commit(SET_IMMUDB, {
							immudb,
						});

						const decompressedTree = decompress(tree) || '';
						commit(SET_MERKLE_TREE, {
							merkleTree: decompressedTree && JSON.parse(decompressedTree),
						});

						commit(SET_CODE_OUTPUT, {
							stderr,
							stdout,
						});
					}

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
