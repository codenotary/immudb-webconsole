import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';

export default ({ store }) => {
	new VuexPersistence({
		key: 'webconsole',
		storage: localforage,
		asyncStorage: true,
		supportCircular: true,
		reducer: state => ({
			// docker: {
			// 	dockerToken: state.docker.dockerToken,
			// },
			view: {
				theme: state.view.theme,
				banner: state.view.banner,
				sidebar: state.view.sidebar,
				paneSizes: state.view.paneSizes,
				hideNotActive: state.view.hideNotActive,
				timezone: state.view.timezone,
			},
			auth: {
				token: state.auth.token,
				user: state.auth.user,
				permission: state.auth.permission,
			},
			database: {
				active: state.database.active,
			},
		}),
	}).plugin(store);
};
