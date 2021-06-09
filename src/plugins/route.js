
import {
	DOCKER_MODULE,
	DOCKER_TOKEN,
} from '@/store/docker/constants';
import {
	AUTH_MODULE,
	TOKEN,
} from '@/store/auth/constants';
import {
	ApiService,
	PrometheusApiService,
} from '@/services/index';

export default function ({ store, app }) {
	const waitForStorageToBeReady = async (to, from, next) => {
		await store.restored;
		const dockerToken = store.getters[`${ DOCKER_MODULE }/${ DOCKER_TOKEN }`];
		const token = store.getters[`${ AUTH_MODULE }/${ TOKEN }`];

		// Config X-Token
		if (process.env.IS_PUBLIC_DEMO) {
			ApiService.defaults.headers
					.common['X-Token'] = dockerToken;
			PrometheusApiService.defaults.headers
					.common['X-Token'] = dockerToken;
		}

		// Config Authorization bearer
		ApiService.defaults.headers
				.common.Authorization = `Bearer ${ token }`;
		next();
	};
	app.router.beforeEach(waitForStorageToBeReady);
};
