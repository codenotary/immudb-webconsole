<template>
	<splitpanes
		class="playground-theme py-0 pr-4"
		horizontal
		:push-other-panes="false"
		@resize="onResizeSecondRow"
	>
		<pane
			min-size="20"
			max-size="100"
		>
			<splitpanes
				:push-other-panes="false"
				:horizontal="mobile"
				@resize="onResizeFirstRow"
			>
				<pane
					v-if="!mobile"
					:size="getTopicPane.size"
					:min-size="getTopicPane.minSize"
					:max-size="getTopicPane.maxSize"
				>
					<LazyTopic />
				</pane>
				<pane
					:size="getGuidePane.size"
					:min-size="getGuidePane.minSize"
					:max-size="getGuidePane.maxSize"
				>
					<LazyGuide />
				</pane>
				<pane>
					<LazyCode
						:size="getCodePane.size"
					/>
				</pane>
			</splitpanes>
		</pane>
		<pane
			:size="getOutputPane.size"
			:min-size="getOutputPane.minSize"
			:max-size="getOutputPane.maxSize"
		>
			<LazyOutput
				:sizes="getOutputPane.size"
			/>
		</pane>
	</splitpanes>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LayoutMixin from '@/mixins/LayoutMixin';
import { ParamMixin, PARAMS } from '@/mixins/ParamMixin';
import { title } from '@/helpers/meta';
import {
	CODE_MODULE,
	FETCH_LANGUAGES,
	FETCH_EXAMPLES,
	FETCH_CODES,
	SET_ACTIVE_EXAMPLE,
} from '@/store/code/constants';
import {
	VIEW_MODULE,
	SET_PANE_SIZES,
	MOBILE,
} from '@/store/view/constants';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

export default {
	name: 'Dashboard',
	components: {
		Splitpanes,
		Pane,
	},
	mixins: [
		LayoutMixin,
		ParamMixin,
	],
	async fetch() {
		await this.fetchLanguages();
		await this.fetchExamples();
		await this.fetchCodes();
	},
	fetchOnServer: false,
	data: () => ({
		codePath: '',
	}),
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
		}),
		getTopicPane () {
			if (this.mobile) {
				return {
					size: 1,
					minSize: 1,
					maxSize: 1,
				};
			}
			return {
				size: 20,
				minSize: 20,
				maxSize: 60,
			};
		},
		getGuidePane () {
			if (this.mobile) {
				return {
					size: 100,
					minSize: 100,
					maxSize: 100,
				};
			}
			return {
				size: 40,
				minSize: 40,
				maxSize: 80,
			};
		},
		getCodePane () {
			if (this.mobile) {
				return {
					size: 20,
					minSize: 60,
					maxSize: 100,
				};
			}
			return {
				size: 40,
				minSize: 40,
				maxSize: 100,
			};
		},
		getOutputPane () {
			if (this.mobile) {
				return {
					size: 20,
					minSize: 20,
					maxSize: 100,
				};
			}
			return {
				size: 33,
				minSize: 33,
				maxSize: 100,
			};
		},
	},
	watch: {
		'$route.query': {
			deep: true,
			handler (newVal) {
				this.codePath = newVal && newVal.code;
			},
		},
		codePath: {
			immediate: true,
			handler (newVal) {
				this.setActiveExample({ activePath: newVal });
			},
		},
	},
	mounted () {
		// track google analytics pageview
		this.$gtag.pageview({
			page_title: 'Dashboard',
			page_location: window && window.location && window.location.href,
			page_path: '/',
		});

		this.codePath = this.getParam(PARAMS.CODE) || '/python/login.py';
	},
	methods: {
		...mapActions(CODE_MODULE, {
			fetchLanguages: FETCH_LANGUAGES,
			fetchExamples: FETCH_EXAMPLES,
			fetchCodes: FETCH_CODES,
			setActiveExample: SET_ACTIVE_EXAMPLE,
		}),
		...mapActions(VIEW_MODULE, {
			setPaneSizes: SET_PANE_SIZES,
		}),
		onResizeFirstRow (data) {
			this.setPaneSizes({
				topic: data && data[0] && data[0].size,
				guide: data && data[1] && data[1].size,
				code: data && data[2] && data[2].size,
			});
		},
		onResizeSecondRow (data) {
			this.setPaneSizes({
				output: this.data && data[1] && data[1].size,
			});
		},
	},
	head() {
		return {
			title: title('Dashboard'),
		};
	},
};
</script>

<style lang="scss">
.playground-theme {
	height: calc(100% - #{$spacer-2}) !important;
	max-height: calc(100% - #{$spacer-2}) !important;
	padding: 0 $spacer-3 0 0;
	margin: 0;

	@media (max-width: 480px) {
		height: auto !important;
		max-height: unset !important;
		padding: 0 $spacer-3;
	}

	&.splitpanes {
		background-color: inherit;

		.splitpanes__splitter {
			min-height: 16px;
			min-width: 16px;
			position: relative;

			&:hover,
			&:active {
				&::before {
					opacity: 1;
				}

				background: #45475b;
			}

			&::before {
				content: '';
				position: absolute;
				height: 16px;
				width: 16px;
				left: 50% !important;
				top: 0 !important;
				background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="%23FFFFFF" d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"></path></svg>');
				background-size: cover;
				background-repeat: no-repeat;
				text-align: center;
				transform: translateY(0%) translateX(-50%) rotate(-90deg);
				opacity: 0.35;
				z-index: 1;
			}
		}

		.splitpanes--vertical {
			> .splitpanes__splitter {
				&::before {
					top: calc(50% - 8px) !important;
					left: 0 !important;
					transform: translateY(-50%) translateX(0%) rotate(0deg) !important;
				}
			}
		}
	}
}
</style>
