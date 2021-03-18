import { ApiService } from '@/services/index';

export const CodeService = {
	runCode(language, data, config) {
		return ApiService.post(`/exec/${ language }`, data, config);
	},
};
