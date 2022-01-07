import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as qs from 'qs';

axiosRetry(axios, { retries: 3 });

export const API_CONFIG = {
	returnRejectedPromiseOnError: true,
	timeout: 30000,
	paramsSerializer: params => qs.stringify(params, { indices: false }),
	headers: {
		common: {
			'Content-Encoding': 'gz',
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Pragma: 'no-cache',
		},
	},
};

export const METRICS_API_CONFIG = {
	headers: {
		common: {
			Pragma: 'no-cache',
		},
	},
};

export const GITHUB_API_CONFIG = {
	headers: {
		common: {
			'content-type': 'application/json; charset=utf-8',
		},
	},
};

// Backend api proxy instance
export const RootService = axios.create({
	...API_CONFIG,
	baseURL: process.env.DOCKER_API_URL,
});

// Backend api proxy instance
export const ApiService = axios.create({
	...API_CONFIG,
	baseURL: process.env.SERVER_URL,
});

// Nuxt embedded api proxy instance
export const EmbeddedApiService = axios.create({
	...API_CONFIG,
	baseURL: 'nuxt_embedded',
});

// Prometheus api proxy instance
export const PrometheusApiService = axios.create({
	timeout: 5000,
	...(process.env.IS_PUBLIC_DEMO ? METRICS_API_CONFIG : {}),
	baseURL: process.env.IS_PUBLIC_DEMO || process.env.TARGET === 'demo'
		? `${ process.env.METRICS_URL }`
		: `${ process.env.METRICS_URL }:9497`,
});

// Github proxy instance
export const GithubApiService = axios.create({
	...GITHUB_API_CONFIG,
	baseURL: process.env.GITHUB_API_URL,
});
