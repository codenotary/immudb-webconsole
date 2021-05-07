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
				class="pa-0 ma-0 d-flex justify-center"
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
						<template v-slot:date>
							{{ new Date().getFullYear() }}
						</template>
						<template v-slot:url>
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
					class="ma-0 ml-4 pa-0 d-flex justify-space-between text-left font-weight-normal"
					cols="auto"
				>
					<span
						v-if="isDevMode"
						class="ma-0 pa-0 d-flex justify-center align-start"
					>
						<v-chip
							class="ma-0 ml-4 py-0 px-2 caption text-uppercase"
							style="margin-top: 2px !important;"
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
					<v-tooltip
						top
						:open-delay="300"
					>
						<template v-slot:activator="{ on, attrs }">
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
							{{ $t(`footer.toggle.${ theme }`) }}
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
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								:class="{
									'gray--text text--darken-1': !$vuetify.theme.dark,
									'gray--text text--lighten-1': $vuetify.theme.dark,
								}"
								depressed
								small
								icon
								href="https://github.com/codenotary/immudb/tree/rest_server_sql"
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
			mdiBrightness6,
			mdiGithub,
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

	@media (max-width: 480px) {
		height: $spacer-20;
	}
}
</style>
