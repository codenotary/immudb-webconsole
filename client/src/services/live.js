import { ApiService } from '@/services/index';

export const LiveService = {
	listContainers(data, config) {
		return ApiService.get('/run/list', data, config);
	},
	startContainer(data, config) {
		return ApiService.post('/run/new', data, config);
	},
	stopContainer(id, data, config) {
		return ApiService.post(`/run/close/${ id }`, data, config);
	},
};
