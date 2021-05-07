import { ApiService } from '@/services/index';

export const ImmudbService = {
	// AUTH
	login (config) {
		return ApiService.post('/login', config);
	},

	// ANALYTICS
	health (config) {
		return ApiService.get('/health', config);
	},
	state (config) {
		return ApiService.get('/db/state', config);
	},

	// USERS
	userList (config) {
		return ApiService.get('/user/list', config);
	},
	addUser (data, config) {
		return ApiService.post('/user', data, config);
	},
	setActiveUser (data, config) {
		return ApiService.post('/user/setactiveUser', data, config);
	},
	updatePassword (data, config) {
		return ApiService.post('/user/password/change', data, config);
	},
	updatePermissions (data, config) {
		return ApiService.post('/user/changepermission', data, config);
	},

	// DATABASE
	databaseList (config) {
		return ApiService.post('/db/list', config);
	},
	tableList (config) {
		return ApiService.get('/db/table/list', config);
	},
	tableDescribe (data, config) {
		return ApiService.post('/db/tables', data, config);
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
