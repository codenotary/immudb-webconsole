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
							'gray--text text--lighten-1': !$vuetify.theme.dark,
							'gray--text text--lighten-4': $vuetify.theme.dark,
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
					class="ma-0 ml-2 pa-0 d-flex justify-space-between align-center text-left font-weight-normal"
					cols="auto"
				>
					<UiImmudbVersion :value="version" />
				</v-col>
				<v-col
					class="ma-0 ml-2 pa-0 d-flex justify-space-between text-left font-weight-normal"
					cols="auto"
				>
					<UiDevBadge v-if="isDevMode" />
				</v-col>
				<v-col
					class="ma-0 ml-2 pa-0 d-flex justify-space-between text-left font-weight-normal"
					cols="auto"
				>
					<UiActionFeedbackBtn />
				</v-col>
				<v-col
					class="ma-0 ml-2 pa-0 d-flex justify-space-between text-left font-weight-normal"
					cols="auto"
				>
					<UiActionGithubBtn />
				</v-col>
			</v-row>
		</v-container>
	</v-footer>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	MOBILE,
} from '@/store/view';
import timeUtils from '@/mixins/timeUtils';
import LayoutMixin from '@/mixins/LayoutMixin';
import { version } from './../../../package';

export default {
	name: 'TheFooter',
	mixins: [
		timeUtils,
		LayoutMixin,
	],
	data () {
		return {
			version,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
		}),
		isDevMode () {
			return process.env.NODE_ENV !== 'production';
		},
	},
};
</script>

<style lang="scss">
#TheFooter {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	height: $footer-height;

	@media (max-width: 480px) {
		height: $spacer-12;
	}
}
</style>
