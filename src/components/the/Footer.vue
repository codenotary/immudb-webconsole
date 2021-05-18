<template>
	<v-footer
		id="TheFooter"
		:elevation="0"
		:fixed="!mobile"
	>
		<v-container
			class="pa-0"
			:class="{
				'pl-0': mobile,
				'pl-12': !mobile,
			}"
			fluid
		>
			<v-row
				class="pa-0 ma-0 d-flex justify-center align-center"
			>
				<v-col
					class="pa-0 d-flex justify-start align-center font-weight-normal"
					:class="`text-${ mobile ? 'center' : 'left' }`"
					cols="auto"
				>
					<i18n
						class="caption"
						:class="{
							'gray--text text--darken-1': !$vuetify.theme.dark,
							'gray--text text--lighten-1': $vuetify.theme.dark,
						}"
						tag="span"
						path="footer.text"
					>
						<template #date>
							{{ new Date().getFullYear() }}
						</template>
						<template #url>
							<a
								class="font-weight-bold"
								href="https://www.codenotary.com/"
								target="_blank"
								rel="noopener"
							>
								CodeNotary, Inc.
							</a>
						</template>
					</i18n>
				</v-col>
				<v-spacer />
				<v-col
					class="ma-0 ml-4 pa-0 d-flex justify-space-between align-center text-left font-weight-normal"
					cols="auto"
				>
					<span
						class="ma-0 pa-0 h-24 caption d-flex justify-start align-center"
						:class="{
							'gray--text text--darken-1': !$vuetify.theme.dark,
							'gray--text text--lighten-1': $vuetify.theme.dark,
						}"
					>
						v
						<span class="caption d-flex justify-start align-center">
							{{ version }}
						</span>
					</span>
				</v-col>
				<v-col
					class="ma-0 ml-4 pa-0 d-flex justify-space-between text-left font-weight-normal"
					cols="auto"
				>
					<span
						v-if="isDevMode"
						class="ma-0 pa-0 d-flex justify-center align-center"
					>
						<v-chip
							class="ma-0 py-0 px-2 caption text-uppercase"
							color="accent"
							small
							dense
						>
							{{ $t('footer.devMode') }}
						</v-chip>
					</span>
				</v-col>
				<v-col
					class="ma-0 ml-4 pa-0 d-flex justify-space-between text-left font-weight-normal"
					cols="auto"
				>
					<v-tooltip top>
						<template #activator="{ on, attrs }">
							<v-hover
								v-slot="{ hover }"
							>
								<v-btn
									href="https://github.com/codenotary/immudb-webconsole/issues/new/choose"
									text
									class="feedback-btn ma-0 px-2 text-none d-flex align-center"
									target="_blank"
									rel="noopener"
									small
									v-bind="attrs"
									v-on="on"
								>
									<v-icon
										class="caption"
										:class="{
											'grey--text text--darken-1': !hover,
											'warning--text text--lighten-1': hover,
										}"
										style="padding-top: 3px;"
										:size="22"
									>
										{{ mdiMessageAlertOutline }}
									</v-icon>
									<span
										class="ml-2 caption d-flex justify-start align-center"
										:class="{
											'grey--text text--darken-1': !hover,
											'warning--text text--lighten-1': hover,
										}"
									>
										{{ $t('footer.feedback.text') }}
									</span>
								</v-btn>
							</v-hover>
						</template>
						{{ $t('footer.feedback.tooltip') }}
					</v-tooltip>
				</v-col>
				<v-col
					class="ma-0 ml-4 pa-0 d-flex justify-space-between text-left font-weight-normal"
					cols="auto"
				>
					<v-tooltip
						top
						:open-delay="300"
					>
						<template #activator="{ on, attrs }">
							<v-btn
								:class="{
									'gray--text text--darken-1': !$vuetify.theme.dark,
									'gray--text text--lighten-1': $vuetify.theme.dark,
								}"
								depressed
								small
								icon
								:alt="$t(`footer.toggle.${ theme }`)"
								v-bind="attrs"
								v-on="on"
								@click="toggleTheme"
							>
								<v-icon
									class="headline grey--text text--darken-3"
									color="white darken-1"
								>
									{{ mdiBrightness6 }}
								</v-icon>
							</v-btn>
						</template>
						<span>
							{{ $t(`footer.theme.toggle.${ theme }`) }}
						</span>
					</v-tooltip>
				</v-col>
				<v-col
					class="ma-0 ml-4 pa-0 d-flex justify-space-between text-left font-weight-normal"
					cols="auto"
				>
					<v-tooltip
						top
						:open-delay="300"
					>
						<template #activator="{ on, attrs }">
							<v-btn
								:class="{
									'gray--text text--darken-1': !$vuetify.theme.dark,
									'gray--text text--lighten-1': $vuetify.theme.dark,
								}"
								depressed
								small
								icon
								href="https://github.com/codenotary/immudb"
								target="_blank"
								:title="$t('footer.github')"
								:alt="$t('footer.github')"
								rel="noopener"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon
									class="headline grey--text text--darken-3"
									color="white darken-1"
								>
									{{ mdiGithub }}
								</v-icon>
							</v-btn>
						</template>
						<span>
							{{ $t('footer.github') }}
						</span>
					</v-tooltip>
				</v-col>
			</v-row>
		</v-container>
	</v-footer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	MOBILE,
	THEME,
	TOGGLE_THEME,
} from '@/store/view';
import timeUtils from '@/mixins/timeUtils';
import LayoutMixin from '@/mixins/LayoutMixin';
import {
	mdiMessageAlertOutline,
	mdiBrightness6,
	mdiGithub,
} from '@mdi/js';

export default {
	name: 'TheFooter',
	mixins: [
		timeUtils,
		LayoutMixin,
	],
	data () {
		return {
			mdiMessageAlertOutline,
			mdiBrightness6,
			mdiGithub,
			version: '1.0.0',
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
			theme: THEME,
		}),
		isDevMode () {
			return process.env.NODE_ENV !== 'production';
		},
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			toggleTheme: TOGGLE_THEME,
		}),
	},
};
</script>

<style lang="scss">
#TheFooter {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	height: $spacer-11;
	background: transparent !important;

	.feedback-btn {
		&::hover {
			.v-btn__content {
				color: red !important;

				span {
					color: red !important;
				}
			}
		}
	}

	@media (max-width: 480px) {
		height: $spacer-20;
	}
}
</style>
