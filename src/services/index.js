import axios from 'axios';
import * as qs from 'qs';

export const API_CONFIG = {
	returnRejectedPromiseOnError: true,
	timeout: 12000,
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

// Backend api proxy instance
export const ApiService = axios.create({
	...API_CONFIG,
	baseURL: process.env.API_URL,
});
