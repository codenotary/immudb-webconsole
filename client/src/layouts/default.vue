<template>
	<v-app id="default-layout">
		<TheNavigationDrawer />
		<TheAppBar
			v-if="mobile"
			class="ma-0 pa-0"
		/>
		<v-main class="ma-0 pa-0 pt-12 pt-sm-0 pl-sm-16 bg">
			<nuxt />
		</v-main>
		<TheFooter />
	</v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SET_THEME,
	MOBILE,
} from '@/store/view/constants';
import LayoutMixin from '@/mixins/LayoutMixin';

export default {
	mixins: [
		LayoutMixin,
	],
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
		}),
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setTheme: SET_THEME,
		}),
		_setTheme (data) {
			if (data) {
				data && this.setTheme(data);
				this.$vuetify.theme.dark = data === 'dark';
				setTimeout(() => {
					this.$vuetify.theme.dark = data === 'dark';
				}, 0);
			}
		},
	},
};
</script>

<style lang="scss">
	.v-main {
		max-height: calc(100vh - #{$spacer-12});

		@media (max-width: 480px) {
			height: auto !important;
			max-height: unset !important;
		}
	}

	.v-content {
		transition: none !important;
	}
</style>
