import axios from 'axios';
import * as qs from 'qs';

export const API_CONFIG = {
	returnRejectedPromiseOnError: true,
	timeout: 30000,
	paramsSerializer: params => qs.stringify(params, { indices: false }),
	headers: {
		common: {
			'Content-Encoding': 'gz',
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			'Content-Type': 'application/json',
			Pragma: 'no-cache',
			Accept: 'application/json',
		},
	},
};

try {
	const vuexStorage = localStorage.getItem('vuex-immudb-webconsole');
	const storangeJSON = vuexStorage && JSON.parse(vuexStorage);
	const { auth: { token } } = storangeJSON || { auth: {} };
	API_CONFIG.headers.common.Authorization = `Bearer ${ token }`;
}
catch (err) {
	console.error(err);
}

// Backend api proxy instance
export const ApiService = axios.create({
	...API_CONFIG,
	baseURL: process.env.API_URL,
});
