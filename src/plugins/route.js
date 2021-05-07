
import { ApiService } from '@/services/index';

export default function ({ store, app }) {
	const waitForStorageToBeReady = async (to, from, next) => {
		await store.restored;
		const token = store.getters['auth/token'];
		ApiService.defaults.headers.common = {
			Authorization: `Bearer ${ token }`,
		};
		next();
	};
	app.router.beforeEach(waitForStorageToBeReady);
};
