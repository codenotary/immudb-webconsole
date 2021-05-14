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

// Backend api proxy instance
export const ApiService = axios.create({
	...API_CONFIG,
	baseURL: process.env.API_URL,
});

// Prometheus api proxy instance
export const PrometheusService = axios.create({
	...API_CONFIG,
	baseURL: window.location.protocol + '//' + window.location.hostname + ':9497',
});
