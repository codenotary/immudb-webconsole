<template>
	<v-app id="default-layout">
		<TheNavigationDrawer />
		<v-main>
			<nuxt />
		</v-main>
		<TheFooter />
	</v-app>
</template>

<script>
import { mapActions } from 'vuex';
import { VIEW_MODULE, SET_THEME } from '@/store/view';
import LayoutMixin from '@/mixins/LayoutMixin';

export default {
	mixins: [
		LayoutMixin,
	],
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
	.v-content {
		transition: none !important;
	}
</style>
