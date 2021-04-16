import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
	window.onNuxtReady(() => {
		new VuexPersistence({
			key: 'vuex-immudb-playground',
			storage: window.localStorage,
			asyncStorage: false,
			supportCircular: false,
			reducer: state => ({
				view: {
					theme: state.view.theme,
				},
			}),
		}).plugin(store);
	});
};