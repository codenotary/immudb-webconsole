import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	THEME,
	MOBILE,
	IS_LOADING,
	SET_THEME,
	SET_MOBILE,
	SET_NUXT_HYDRATED,
} from '@/store/view';

export default {
	computed: {
		...mapGetters(VIEW_MODULE, {
			theme: THEME,
			isMobile: MOBILE,
			isLoading: IS_LOADING,
		}),
		isDarkTheme () {
			return this.theme === 'dark';
		},
	},
	watch: {
		theme (newVal) {
			this.toggleBodyClass(`theme--${ newVal === 'dark' ? 'light' : 'dark' }`, false);
			this.toggleBodyClass(`theme--${ newVal }`);
			this.$vuetify.theme.dark = newVal === 'dark';
			setTimeout(() => {
				this.$vuetify.theme.dark = newVal === 'dark';
			}, 0);
		},
	},
	mounted () {
		this.setNuxtHydrated(true);
		this.onResize();

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', this.onResize, { passive: true });
		}
	},
	beforeDestroy () {
		this.toggleBodyClass(`theme--${ process.env.UI_THEME }`, false);

		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', this.onResize, { passive: true });
		}
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setTheme: SET_THEME,
			setMobile: SET_MOBILE,
			setNuxtHydrated: SET_NUXT_HYDRATED,
		}),
		onResize () {
			this.setMobile(window.innerWidth < 600);
		},
		toggleBodyClass(className, add = true) {
			// const el = document && document.body;
			// add ? el.classList.add(className) : el.classList.remove(className);
		},
	},
};
