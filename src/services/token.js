import { RootService } from '@/services/index';

export const TokenService = {
	// ROOT
	token (config) {
		return RootService.get('/token', config);
	},
};
