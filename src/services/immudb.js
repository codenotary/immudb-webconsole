import { ApiService } from '@/services/index';

export const ImmudbService = {
	// AUTH
	login (config) {
		return ApiService.post('/login', config);
	},
	health (config) {
		return ApiService.get('/health', config);
	},

	// METRICS & STATS
	state (config) {
		return ApiService.get('/db/state', config);
	},
	// DATABASE
	tableList (config) {
		return ApiService.get('/db/table/list', config);
	},
	tableDescrive (data, config) {
		return ApiService.post('/db/tables', data, config);
	},

	// USERS
	users (config) {
		return ApiService.get('users', config);
	},

	// SQL
	sqlExec (data, config) {
		return ApiService.post('/db/sqlexec', data, config);
	},
	sqlQuery (data, config) {
		return ApiService.post('/db/sqlquery', data, config);
	},

	// IMMUDB
	set (config) {
		return ApiService.post('/db/set', config);
	},
	get (config) {
		return ApiService.post('/db/get', config);
	},
};
