import { PrometheusService } from '@/services/index';

export const MetricsService = {
	// PROMETHEUS
	metrics (config) {
		return PrometheusService.get('/metrics', config);
	},
};
