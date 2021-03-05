import { ApiService } from '@/services/index';

export const CodeService = {
	runCode(data, config) {
		return ApiService.post('/exec/run', data, config);
	},
};
