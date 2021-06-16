<template>
	<v-dialog
		:value="value"
		:content-class="`splash-screen bg-secondary theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
		fullscreen
		persistent
		no-click-animation
		transition="slide-y-transition"
	>
		<div class="ma-0 pa-0 d-flex flex-column justify-center align-center fill-height">
			<v-img
				class="mascotte mt-8 mt-sm-16 mx-0 pa-0"
				src="/images/mascotte/immudb_mascot_shadowed.svg"
				:alt="$t('common.gopher')"
				height="10%"
				:min-height="`${ $vuetify.breakpoint.smAndDown ? '185' : '245' }px`"
				max-height="245px"
				contain
			/>
			<v-row class="ma-0 pa-0 d-flex flex-grow-0 justify-center align-start fill-width">
				<v-col
					class="ma-0 pt-4 pb-2 d-flex justify-center align-center"
					cols="12"
					sm="6"
					md="4"
					lg="3"
				>
					<UiLogoImmudb
						:height="32"
					/>
				</v-col>
			</v-row>
			<v-spacer />
			<v-row class="ma-0 pa-0 d-flex justify-center align-start fill-width">
				<v-col
					v-if="showAuthForm"
					class="ma-0 pa-0 d-flex justify-center align-start fill-height"
					cols="12"
					sm="6"
					md="4"
					lg="3"
				>
					<UiFormAuth
						@submit="onSubmit"
					/>
				</v-col>
				<v-col
					v-else
					class="ma-0 pa-0 d-flex justify-center align-center fill-height"
					cols="12"
					sm="6"
					md="4"
					lg="3"
				>
					<v-progress-circular
						class="ma-0 mt-4 pa-0 d-flex justify-center align-center fill-height"
						:size="96"
						color="primary"
						indeterminate
					>
						<span
							class="ma-0 pa-0 body-2 text-capitalize"
							:class="{
								'gray--text text--lighten-1': !$vuetify.theme.dark,
								'gray--text text--lighten-4': $vuetify.theme.dark,
							}"
						>
							{{ $t('common.loading') }}
						</span>
					</v-progress-circular>
				</v-col>
			</v-row>
			<v-spacer />
			<div class="ma-0 my-2 my-sm-4 pa-0 d-flex flex-column justify-center align-start fill-width">
				<UiLogoCodeNotary
					:height="64"
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
	DOCKER_MODULE,
	DOCKER_TOKEN,
} from '@/store/docker/constants';
import {
	AUTH_MODULE,
	TOKEN,
} from '@/store/auth/constants';
export default {
	name: 'UiModalSplash',
	props: {
		value: { type: Boolean, default: true },
		duration: { type: [String, Number], default: '3000' },
	},
	computed: {
		...mapGetters(DOCKER_MODULE, {
			dockerToken: DOCKER_TOKEN,
		}),
		...mapGetters(AUTH_MODULE, {
			token: TOKEN,
		}),
		showAuthForm () {
			return !this.token;
		},
	},
	mounted () {
		setTimeout(() => {
			if ((!process.env.IS_PUBLIC_DEMO || this.dockerToken) && this.token) {
				this.setSplash(false);
				this.onClose();
			}
		}, this.duration);
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
	.logo,
	.immudb,
	.mascotte {
		transition: all ease-in-out 0.3s !important;
	}
}
</style>
