import { MetricsService } from '@/services/metrics';
import parsePrometheusTextFormat from 'parse-prometheus-text-format';
import {
	VIEW_MODULE,
	PUSH_LOADING,
	POP_LOADING,
} from '@/store/view/constants';
import {
	FETCH_METRICS,
	SET_METRICS,
} from './constants';

export default {
	async [FETCH_METRICS]({ commit }) {
		const LOADING_LABEL = 'fetchMetrics';
		try {
			commit(`${ VIEW_MODULE }/${ PUSH_LOADING }`, { label: LOADING_LABEL, silently: true }, { root: true });

			const response = await MetricsService.metrics();

			if (response && response.data) {
				const parsed = parsePrometheusTextFormat(response.data);

				commit(SET_METRICS, {
					dbSize: parsed.find(_ => _ && _.name === 'immudb_db_size_bytes'),
					memSysBytes: parsed.find(_ => _ && _.name === 'go_memstats_sys_bytes'),
					heapInUseBytes: parsed.find(_ => _ && _.name === 'go_memstats_heap_inuse_bytes'),
					stackInUseBytes: parsed.find(_ => _ && _.name === 'go_memstats_stack_inuse_bytes'),
					grpcServerHandlingSeconds: parsed.filter(_ => _ && _.name === 'grpc_server_handling_seconds'),
				});
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
	[SET_METRICS]({ commit }, payload) {
		commit(SET_METRICS, payload);
	},
};
