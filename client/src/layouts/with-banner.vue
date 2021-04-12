<template>
	<v-app
		id="WithBannerLayout"
		:class="{ 'active' : active && bannerOpen }"
	>
		<TheBanner
			id="TheBanner"
			@mouseenter.native="bannerHover = true"
			@mouseleave.native="hobannerHoverver = false"
			@close="bannerOpen = false"
		/>
		<TheNavigationDrawer />
		<TheAppBar
			v-if="mobile"
			class="ma-0 pa-0 pt-sm-6"
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

const ACTIVATION_DELAY = 3000;

export default {
	mixins: [
		LayoutMixin,
	],
	data () {
		return {
			active: false,
			bannerOpen: true,
			bannerHover: true,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
		}),
	},
	mounted () {
		setTimeout(() => {
			this.active = true;
		}, ACTIVATION_DELAY);
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
#WithBannerLayout {
	.v-system-bar {
		max-height: 0;
		transition: max-height 0.15s ease-out;
		overflow: hidden !important;
	}

	.v-navigation-drawer {
		margin-top: 0;
	}

	.v-main {
		max-height: calc(100vh - #{$spacer-12} - #{$spacer-6});
		margin-top: $spacer-12;

		@media (max-width: 480px) {
			height: auto !important;
			max-height: unset !important;
		}
	}

	&.active {
		.v-system-bar {
			max-height: $spacer-6;
			transition: max-height 0.25s ease-in;
		}

		.v-navigation-drawer {
			margin-top: $spacer-6 !important;
		}

		.v-main {
			padding-top: $spacer-6 !important;
		}
	}

	.v-content {
		transition: none !important;
	}
}
</style>
