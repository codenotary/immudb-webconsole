<template>
	<v-dialog
		:value="value"
		:content-class="`splash-screen theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
		fullscreen
		persistent
		no-click-animation
		transition="slide-y-transition"
	>
		<div class="ma-0 pa-0 d-flex flex-column justify-center align-center fill-height">
			<v-img
				class="mascotte mt-16 mx-0 pa-0"
				lazy-src="/images/mascotte/mascotte_lazy.png"
				src="/images/mascotte/mascotte.png"
				:alt="$t('common.gopher')"
				height="10%"
				min-height="144px"
				max-height="320px"
				contain
			/>
			<v-row class="ma-0 pa-0 d-flex justify-center align-end fill-width">
				<v-col
					class="ma-0 py-0 px-4 d-flex justify-center align-center"
					cols="12"
					sm="8"
					md="6"
					lg="4"
				>
					<span
						class="ma-0 pa-0 display-1"
						:class="{
							'text-center': !showAuthForm,
						}"
					>
						{{ $t('login.title') }}
					</span>
				</v-col>
			</v-row>
			<v-row class="ma-0 pa-0 d-flex justify-center align-start fill-width">
				<v-col
					v-if="showAuthForm"
					class="ma-0 pa-0 d-flex justify-center align-start fill-height"
					cols="12"
					sm="8"
					md="6"
					lg="4"
				>
					<UiFormAuth
						@submit="onSubmit"
					/>
				</v-col>
				<v-col
					v-else
					class="ma-0 pa-0 d-flex justify-center align-center fill-height"
					cols="12"
					sm="8"
					md="6"
					lg="4"
				>
					<v-progress-circular
						class="ma-0 mt-4 pa-0 d-flex justify-center align-center fill-height"
						:size="96"
						color="accent"
						indeterminate
					>
						<span
							class="ma-0 pa-0 body-2 text-capitalize"
							:class="{
								'gray--text text--darken-1': !$vuetify.theme.dark,
								'gray--text text--lighten-1': $vuetify.theme.dark,
							}"
						>
							{{ $t('common.loading') }}
						</span>
					</v-progress-circular>
				</v-col>
			</v-row>
			<v-spacer />
			<div class="ma-0 mb-4 pa-0 d-flex flex-column justify-center align-start fill-width">
				<span
					class="ma-0 mb-n5 pl-4 pa-0 caption d-flex justify-center  fill-width"
					:class="{
						'gray--text text--darken-1': !$vuetify.theme.dark,
						'gray--text text--lighten-1': $vuetify.theme.dark,
					}"
				>
					{{ $t('common.poweredBy') }}
				</span>
				<v-img
					class="immudb"
					:src="getAsset"
					:alt="$t('common.immudb')"
					height="48px"
					contain
				/>
			</div>
		</div>
	</v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	SET_SPLASH,
} from '@/store/view/constants';
import {
	AUTH_MODULE,
	TOKEN,
} from '@/store/auth/constants';

export default {
	name: 'UiModalSplash',
	props: {
		value: { type: Boolean, default: true },
		text: { type: Boolean, default: true },
		svg: { type: Boolean, default: true },
		duration: { type: [String, Number], default: '3000' },
	},
	computed: {
		...mapGetters(AUTH_MODULE, {
			token: TOKEN,
		}),
		getTheme () {
			return this.$vuetify.theme.dark ? 'dark' : 'light';
		},
		getMime () {
			return this.svg ? 'svg' : 'png';
		},
		getAsset () {
			return require(`@/static/images/immudb/logo_${ this.getTheme }_${ (this.text ? 'text' : '') }.${ this.getMime }`);
		},
		showAuthForm () {
			return !this.token;
		},
	},
	created () {
		if (this.token) {
			setTimeout(() => {
				this.setSplash(false);
				this.onClose();
			}, this.duration);
		}
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setSplash: SET_SPLASH,
		}),
		onClose () {
			this.$emit('input', false);
		},
		onSubmit (data) {
			this.$emit('submit', data);
		},
	},
};
</script>

<style lang="scss">
.splash-screen {
	&.theme-- {
		&dark {
			background-color: #21222c;

			.immudb svg g {
				color: #fff !important;
			}
		}

		&light {
			background-color: #fff;

			.immudb svg g {
				color: #21222c !important;
			}
		}
	}

	.logo,
	.immudb,
	.mascotte {
		transition: all ease-in-out 0.3s !important;
	}
}
</style>
