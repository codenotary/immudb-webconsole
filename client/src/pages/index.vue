<template>
	<splitpanes
		class="playground-theme py-0 pr-4"
		:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
		horizontal
		:push-other-panes="true"
		@resize="onResizeFourthPane"
	>
		<pane
			min-size="20"
			max-size="100"
		>
			<splitpanes
				:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
				:push-other-panes="true"
				:horizontal="mobile"
			>
				<pane
					v-if="!mobile"
					:size.sync="getTopicPane.size"
					:min-size="getTopicPane.minSize"
					:max-size="getTopicPane.maxSize"
				>
					<LazyTopic />
				</pane>

				<pane>
					<splitpanes
						:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
						:push-other-panes="true"
						:horizontal="mobile"
					>
						<pane
							v-if="showGuide"
							:size.sync="getGuidePane.size"
							:min-size="getGuidePane.minSize"
							:max-size="getGuidePane.maxSize"
						>
							<LazyGuide />
						</pane>
						<pane
							v-if="showCode"
						>
							<LazyCode
								:size.sync="getCodePane.size"
								:min-size="getCodePane.minSize"
								:max-size="getCodePane.maxSize"
							/>
						</pane>
						<pane
							v-if="!showCode && showLive"
						>
							<LazyLive
								:size.sync="getLivePane.size"
								:min-size="getLivePane.minSize"
								:max-size="getLivePane.maxSize"
							/>
						</pane>
					</splitpanes>
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
import { metaTitle } from '@/helpers/meta';
import {
	TOPIC_MODULE,
	FETCH_TOPICS,
	SET_ACTIVE_TOPIC,
	ACTIVE_TOPIC,
	DEFAULT_TOPIC,
} from '@/store/topic/constants';
import {
	GUIDE_MODULE,
	SET_ACTIVE_GUIDE,
	ACTIVE_GUIDE,
} from '@/store/guide/constants';
import {
	CODE_MODULE,
	FETCH_LANGUAGES,
	FETCH_CODE,
	ACTIVE_CODE,
} from '@/store/code/constants';
import {
	LIVE_MODULE,
	FETCH_LIVE,
	ACTIVE,
} from '@/store/live/constants';
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
		try {
			const response = await this.$content('guides', { deep: true })
					.fetch();
			await this.fetchTopics(response);
			await this.fetchLanguages();
			this.fetchLive();
		}
		catch (err) {
			console.error('FETCH', err);
		}
	},
	fetchOnServer: false,
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
		}),
		...mapGetters(TOPIC_MODULE, {
			activeTopic: ACTIVE_TOPIC,
		}),
		...mapGetters(GUIDE_MODULE, {
			activeGuide: ACTIVE_GUIDE,
		}),
		...mapGetters(CODE_MODULE, {
			activeCode: ACTIVE_CODE,
		}),
		...mapGetters(LIVE_MODULE, {
			liveActive: ACTIVE,
		}),
		showGuide () {
			return this.activeGuide && this.activeGuide.guide;
		},
		showCode () {
			return this.activeCode;
		},
		showLive () {
			return this.liveActive;
		},
		getTopicPane () {
			if (this.mobile) {
				return { size: 1, minSize: 1, maxSize: 1 };
			}
			return { size: 20, minSize: 20, maxSize: 60 };
		},
		getGuidePane () {
			if (this.mobile) {
				return { size: 100, minSize: 100, maxSize: 100 };
			}
			return { size: 100, minSize: 20, maxSize: 100 };
		},
		getCodePane () {
			if (this.mobile) {
				return { size: 20, minSize: 60, maxSize: 100 };
			}
			return { size: 0, minSize: 20, maxSize: 100 };
		},
		getLivePane () {
			if (this.mobile) {
				return { size: 20, minSize: 60, maxSize: 100 };
			}
			return { size: 0, minSize: 20, maxSize: 100 };
		},
		getOutputPane () {
			if (this.mobile) {
				return { size: 20, minSize: 20, maxSize: 100 };
			}
			return { size: 33, minSize: 20, maxSize: 100 };
		},
	},
	watch: {
		'$route.query': {
			deep: true,
			immediate: true,
			handler (newVal) {
				if (newVal) {
					const { topic } = newVal;
					this.setActiveTopic({ activePath: topic });
				}
			},
		},
		activeTopic: {
			deep: true,
			async handler (newVal) {
				const topicParam = this.getParam(PARAMS.TOPIC) || 'welcome';
				const topic = await this.$content('guides', topicParam).fetch();
				const { code, live } = topic || DEFAULT_TOPIC;
				this.setActiveGuide(topic);
				this.fetchCode({ code });
				this.fetchLive({ live });
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
	},
	methods: {
		...mapActions(VIEW_MODULE, {
			setPaneSizes: SET_PANE_SIZES,
		}),
		...mapActions(TOPIC_MODULE, {
			fetchTopics: FETCH_TOPICS,
			setActiveTopic: SET_ACTIVE_TOPIC,
		}),
		...mapActions(GUIDE_MODULE, {
			setActiveGuide: SET_ACTIVE_GUIDE,
		}),
		...mapActions(CODE_MODULE, {
			fetchLanguages: FETCH_LANGUAGES,
			fetchCode: FETCH_CODE,
		}),
		...mapActions(LIVE_MODULE, {
			fetchLive: FETCH_LIVE,
		}),
		onResizeFourthPane(data) {
			this.setPaneSizes({
				output: data && data[1] && data[1].size,
			});
		},
	},
	head() {
		return {
			title: metaTitle('Dashboard'),
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

	&.theme-- {
		&light {
			background-color: #fff !important;

			.v-card__text {
				box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.25);
			}

			.splitpanes__splitter {
				background-color: #fff;

				&:hover,
				&:active {
					background-color: #dfe6ed;
				}

				&::before {
					background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="%2321222c" d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"></path></svg>');
				}
			}
		}

		&dark {
			background-color: #21222c !important;

			.v-card__text {
				box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.25);
			}

			.splitpanes__splitter {
				&:hover,
				&:active {
					background-color: #45475b;
				}

				&::before {
					background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="%23F5F5F5" d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"></path></svg>');
				}
			}
		}
	}

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
			}

			&::before {
				content: '';
				position: absolute;
				height: 16px;
				width: 16px;
				left: 50% !important;
				top: 0 !important;
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
					top: calc(50% + 33px - 8px) !important;
					left: 0 !important;
					transform: translateY(-50%) translateX(0%) rotate(0deg) !important;
				}
			}
		}
	}
}
</style>
