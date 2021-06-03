import {
	DOCKER_MODULE,
	FETCH_DOCKER_TOKEN,
	SET_DOCKER_TOKEN,
	DOCKER_TOKEN,
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

const VERBOSE = !process.env.IS_PROD;

export default ({ store }) => {
	ApiService.interceptors.request.use(
		async (config) => {
			VERBOSE && console.log('Making api request to ' + config.url);
			if (process.env.IS_PUBLIC_DEMO) {
				const dockerToken = store.getters[`${ DOCKER_MODULE }/${ DOCKER_TOKEN }`];
				if (!dockerToken) {
					await store.dispatch(`${ DOCKER_MODULE }/${ FETCH_DOCKER_TOKEN }`, null);
				}
				if (!ApiService.defaults.headers.common[X_TOKEN_HEADER]) {
					const dockerToken = store.getters[`${ DOCKER_MODULE }/${ DOCKER_TOKEN }`];
					ApiService.defaults.headers
							.common[X_TOKEN_HEADER] = dockerToken;
					config.headers[X_TOKEN_HEADER] = dockerToken;
				}
			}
			return config;
		},
	);

	PrometheusApiService.interceptors.request.use(
		async (config) => {
			VERBOSE && console.log('Making metrics request to ' + config.url);
			if (process.env.IS_PUBLIC_DEMO) {
				const dockerToken = store.getters[`${ DOCKER_MODULE }/${ DOCKER_TOKEN }`];
				if (!dockerToken) {
					await store.dispatch(`${ DOCKER_MODULE }/${ FETCH_DOCKER_TOKEN }`, null);
				}
				if (!PrometheusApiService.defaults.headers.common[X_TOKEN_HEADER]) {
					const dockerToken = store.getters[`${ DOCKER_MODULE }/${ DOCKER_TOKEN }`];
					PrometheusApiService.defaults.headers.common[X_TOKEN_HEADER] = dockerToken;
					config.headers[X_TOKEN_HEADER] = dockerToken;
				}
			}
			return config;
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

					if (IS_BAD_DOCKER_TOKEN_ERROR && !RETRY_REQUEST && !WHITELISTED) {
						store.commit(`${ AUTH_MODULE }/${ SET_TOKEN }`, null);
						ApiService.defaults.headers
								.common[X_TOKEN_HEADER] = undefined;
						config.headers[X_TOKEN_HEADER] = undefined;
						setTimeout(() => {
							return ApiService.request(config);
						}, 600);
					}
					else if (IS_UNHAUTORIZED_ERROR && !RETRY_REQUEST && !WHITELISTED) {
						store.commit(`${ DOCKER_MODULE }/${ SET_DOCKER_TOKEN }`, null);
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
					const { status: code, config } = err.response;
					const IS_BAD_DOCKER_TOKEN_ERROR = code === 406 || code === 410;

					if (IS_BAD_DOCKER_TOKEN_ERROR) {
						store.commit(`${ AUTH_MODULE }/${ SET_TOKEN }`, null);
						PrometheusApiService.defaults.headers
								.common[X_TOKEN_HEADER] = undefined;
						config.headers[X_TOKEN_HEADER] = undefined;
						setTimeout(() => {
							return PrometheusApiService.request(config);
						}, 600);
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
