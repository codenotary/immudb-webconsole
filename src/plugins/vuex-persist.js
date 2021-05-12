import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';

export default ({ store }) => {
	// window.onNuxtReady(() => {
	new VuexPersistence({
		key: 'webconsole',
		storage: localforage,
		asyncStorage: true,
		supportCircular: true,
		reducer: state => ({
			view: {
				theme: state.view.theme,
				hideDisabled: state.view.hideDisabled,
			},
			auth: {
				token: state.auth.token,
			},
			database: {
				active: state.database.active,
			},
		}),
	}).plugin(store);
	// });
};
