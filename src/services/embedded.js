import { EmbeddedApiService } from '@/services/index';

export const EmbeddedService = {
	// VERSION JSON FILE
	version (config) {
		return EmbeddedApiService.get('/version.json', config);
	},
};
