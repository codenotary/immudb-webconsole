import {
	DOCKER_MODULE,
	SET_DOCKER_TOKEN,
} from '@/store/docker/constants';
import {
	AUTH_MODULE,
	SET_TOKEN,
} from '@/store/auth/constants';
import {
	ApiService,
	PrometheusApiService,
} from '@/services/index';

/***
 * Defines the url requests that should not require the logout
 */
const URL_WHITELISTED = [];

const X_TOKEN_HEADER = 'X-Token';

/***
 * Defines the error substrings that should not require the logout
 */
const PAYLOAD_MESSAGES_WHITELISTED = [];

const PLEASE_LOGIN_FIRST = 'please login first';

const VERBOSE = !process.env.IS_PROD && false;

export default ({ store }) => {
	ApiService.interceptors.request.use(
		(config) => {
			VERBOSE && console.log('Making api request to ' + config.url);
			if (!process.env.IS_PUBLIC_DEMO ||
					config.headers.common[X_TOKEN_HEADER]) {
				return config;
			}
			return false;
		},
	);

	PrometheusApiService.interceptors.request.use(
		(config) => {
			VERBOSE && console.log('Making metrics request to ' + config.url);
			if (!process.env.IS_PUBLIC_DEMO ||
				config.headers.common[X_TOKEN_HEADER]) {
				return config;
			}
			return false;
		},
	);

	ApiService.interceptors.response.use(
		undefined,
		(err) => {
			try {
				// Error Handler
				if (err && err.response) {
					const { status: code, config, data } = err.response;
					const url = config && config.url;
					const error = data ? (data.error + '').toLowerCase() : undefined;
					const { message } = data;

					const IS_BAD_DOCKER_TOKEN_ERROR = code === 406 || code === 410;
					const IS_UNHAUTORIZED_ERROR = code === 401 || code === 403;
					const IS_INTERNAL_SERVER_ERROR = code === 500;
					const RETRY_REQUEST = config && config.__isRetryRequest;
					const WHITELISTED = URL_WHITELISTED.some(x => url.includes(x)) ||
						PAYLOAD_MESSAGES_WHITELISTED.some(x => error && error.includes(x));

					if (IS_BAD_DOCKER_TOKEN_ERROR) {
						store.commit(`${ DOCKER_MODULE }/${ SET_DOCKER_TOKEN }`, null);
						store.commit(`${ AUTH_MODULE }/${ SET_TOKEN }`, null);

						// Config X-Token
						if (process.env.IS_PUBLIC_DEMO) {
							ApiService.defaults.headers
									.common[X_TOKEN_HEADER] = undefined;
						}
						ApiService.defaults.headers
								.common.Authorization = undefined;
					}
					else if (IS_UNHAUTORIZED_ERROR && !RETRY_REQUEST && !WHITELISTED) {
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

	PrometheusApiService.interceptors.response.use(
		undefined,
		(err) => {
			try {
				// Error Handler
				if (err && err.response) {
					const { status: code } = err.response;
					const IS_BAD_DOCKER_TOKEN_ERROR = code === 406 || code === 410;

					if (IS_BAD_DOCKER_TOKEN_ERROR) {
						store.commit(`${ DOCKER_MODULE }/${ SET_DOCKER_TOKEN }`, null);

						// Config X-Token
						if (process.env.IS_PUBLIC_DEMO) {
							PrometheusApiService.defaults.headers
									.common[X_TOKEN_HEADER] = undefined;
						}
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
