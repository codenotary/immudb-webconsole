import { ApiService } from '@/services/index';

export const ImmudbService = {
	login (config) {
		return ApiService.post('/login', config);
	},
	health (config) {
		return ApiService.get('/health', config);
	},
	state (config) {
		return ApiService.get('/db/state', config);
	},
	tableList (config) {
		return ApiService.get('/db/table/list', config);
	},
	tableDescrive (data, config) {
		return ApiService.post('/db/tables', data, config);
	},
	set (config) {
		return ApiService.post('/db/set', config);
	},
	get (config) {
		return ApiService.post('/db/get', config);
	},
	sqlExec (data, config) {
		return ApiService.post('/db/sqlexec', data, config);
	},
	sqlQuery (data, config) {
		return ApiService.post('/db/sqlquery', data, config);
	},
};
