// import Vue from 'vue';
import {
	AUTH_MODULE,
	SET_TOKEN,
} from '@/store/auth/constants';
import { ApiService, PrometheusApiService } from '@/services/index';

/***
 * Defines the url requests that should not require the logout
 */
const URL_WHITELISTED = [];

/***
 * Defines the error substrings that should not require the logout
 */
const PAYLOAD_MESSAGES_WHITELISTED = [];

const PLEASE_LOGIN_FIRST = 'please login first';

const VERBOSE = !process.env.IS_PROD;

export default ({ store }) => {
	ApiService.interceptors.request.use(
		(config) => {
			try {
				VERBOSE && console.log(`Making immudb request to ${ config.url }`, config.headers);
				return config;
			}
			catch (err) {
				console.error(err);
				throw err;
			}
		},
	);

	PrometheusApiService.interceptors.request.use(
		(config) => {
			try {
				VERBOSE && console.log(`Making prometheus request to ${ config.url }`, config.headers);
				return config;
			}
			catch (err) {
				console.error(err);
				throw err;
			}
		},
	);

	ApiService.interceptors.response.use(
		undefined,
		(err) => {
			try {
				// Error 401 Handler
				if (err && err.response) {
					const { status: code, config, data } = err.response;
					const url = config && config.url;
					const error = data ? (data.error + '').toLowerCase() : undefined;
					const { message } = data;

					const IS_UNHAUTORIZED_ERROR = code === 401 || code === 403;
					const IS_INTERNAL_SERVER_ERROR = code === 500;
					const RETRY_REQUEST = config && config.__isRetryRequest;
					const WHITELISTED = URL_WHITELISTED.some(x => url.includes(x)) ||
						PAYLOAD_MESSAGES_WHITELISTED.some(x => error && error.includes(x));

					if (IS_UNHAUTORIZED_ERROR && !RETRY_REQUEST && !WHITELISTED) {
						store.commit(`${ AUTH_MODULE }/${ SET_TOKEN }`, null);
					}
					else if (IS_INTERNAL_SERVER_ERROR && message === PLEASE_LOGIN_FIRST) {
						store.commit(`${ AUTH_MODULE }/${ SET_TOKEN }`, null);
					}

					return Promise.reject(err);
				}
			}
			catch (err2) {
				console.error(err2);
			}
		},
	);
};
