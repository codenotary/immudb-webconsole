import { PrometheusApiService } from '@/services/index';

export const MetricsService = {
	// PROMETHEUS
	metrics (config) {
		return PrometheusApiService.get('/metrics', config);
	},
};
