import { ApiService } from '@/services/index';

export const InfoService = {
	fetchInfo (config) {
		return ApiService.get('/info/version', config);
	},
};
