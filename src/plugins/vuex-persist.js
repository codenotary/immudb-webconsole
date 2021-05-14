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
				sidebar: state.view.sidebar,
				paneSizes: state.view.paneSizes,
				hideNotActive: state.view.hideNotActive,
				timezone: state.view.timezone,
			},
			auth: {
				token: state.auth.token,
				user: state.auth.user,
			},
			database: {
				active: state.database.active,
			},
		}),
	}).plugin(store);
	// });
};
