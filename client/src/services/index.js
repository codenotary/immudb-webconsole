import axios from 'axios';
import * as qs from 'qs';

export const API_CONFIG = {
	returnRejectedPromiseOnError: true,
	timeout: 10000,
	paramsSerializer: params => qs.stringify(params, { indices: false }),
	headers: {
		common: {
			'Accept-Encoding': 'gzip',
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			'Content-Type': 'application/json',
			Pragma: 'no-cache',
			Accept: 'application/json',
		},
	},
};

// Backend api proxy instance
export const ApiService = axios.create({
	...API_CONFIG,
	baseURL: process.env.API_URL,
});

export const ApiServiceFetch = (method, url, data, config) => {
	return fetch(`${ API_CONFIG.baseURL }${ url }`, {
		method,
		headers: ApiService.defaults.headers.common,
		body: JSON.stringify(data),
		...config,
	});
};
