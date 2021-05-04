import {
	IMMUDB_MODULE,
	SET_TOKEN,
} from '@/store/immudb/constants';
import { ApiService } from '@/services/index';

/***
 * Defines the url requests that should not require the logout
 */
const URL_WHITELISTED = [];

/***
 * Defines the error substrings that should not require the logout
 */
const PAYLOAD_MESSAGES_WHITELISTED = [];

const VERBOSE = false;

export default ({ store }) => {
	ApiService.interceptors.request.use(
		(config) => {
			VERBOSE && console.log('Making immudb request to ' + config.url);
			return config;
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

					const IS_UNHAUTORIZED_ERROR = code === 401 || code === 403;
					const RETRY_REQUEST = config && config.__isRetryRequest;
					const WHITELISTED = URL_WHITELISTED.some(x => url.includes(x)) ||
						PAYLOAD_MESSAGES_WHITELISTED.some(x => error && error.includes(x));

					if (IS_UNHAUTORIZED_ERROR && !RETRY_REQUEST && !WHITELISTED) {
						store.commit(`${ IMMUDB_MODULE }/${ SET_TOKEN }`, null);
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
