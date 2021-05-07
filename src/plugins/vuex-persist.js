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
			},
			auth: {
				token: state.auth.token,
			},
		}),
	}).plugin(store);
	// });
};