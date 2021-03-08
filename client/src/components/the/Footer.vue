<template>
	<v-footer
		id="TheFooter"
		class="bg"
		:elevation="0"
		:fixed="!mobile"
	>
		<v-container
			class="pa-0"
			:class="{
				'pl-0': mobile,
				'pl-16': !mobile,
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
						class="caption grey--text text--lighten-0"
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
						v-if="version"
						class="caption grey--text text--darken-3"
					>
						v
						<span class="overline">
							{{ version }}
						</span>
					</span>
					<span
						v-if="isDevMode"
						class="overline grey--text text--darken-3"
					>
						&nbsp;-&nbsp;{{ $t('footer.devMode') }}
					</span>
				</v-col>
				<v-col
					class="ma-0 ml-4 pa-0 d-flex justify-space-between text-left font-weight-normal"
					cols="auto"
				>
					<v-tooltip
						top
					>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								icon
								depressed
								small
								href="https://github.com/codenotary/immudb-playground"
								target="_blank"
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
	INFO_MODULE,
	FETCH_INFO,
	VERSION,
} from '@/store/info/constants';
import {
	VIEW_MODULE,
	MOBILE,
	THEME,
	TOGGLE_THEME,
} from '@/store/view';
import LayoutMixin from '@/mixins/LayoutMixin';
import {
	mdiBrightness6,
	mdiGithub,
} from '@mdi/js';

export default {
	name: 'TheFooter',
	mixins: [
		LayoutMixin,
	],
	data () {
		return {
			mdiBrightness6,
			mdiGithub,
		};
	},
	computed: {
		...mapGetters(INFO_MODULE, {
			version: VERSION,
		}),
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
			theme: THEME,
		}),
		isDevMode () {
			return process.env.NODE_ENV !== 'production';
		},
	},
	async mounted () {
		await this.fetchInfo();
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			toggleTheme: TOGGLE_THEME,
		}),
		...mapActions(INFO_MODULE, {
			fetchInfo: FETCH_INFO,
		}),
	},
};
</script>

<style lang="scss">
#TheFooter {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	height: $spacer-12;

	@media (max-width: 480px) {
		height: $spacer-20;
	}
}
</style>
