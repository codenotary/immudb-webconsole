<template>
	<splitpanes
		class="playground-theme py-0 pr-4"
		:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
		horizontal
		:push-other-panes="true"
		@resize="onResizeFourthPane"
	>
		<pane
			:size.sync="banana"
			:min-size="getConstraints.examples.minSize"
			:max-size="getConstraints.examples.maxSize"
		>
			<splitpanes
				:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
				:push-other-panes="true"
				:horizontal="mobile"
			>
				<pane
					v-if="!mobile"
					:size.sync="sizes.topic"
					:min-size="getConstraints.topic.minSize"
					:max-size="getConstraints.topic.maxSize"
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
							:size.sync="sizes.guide"
							:min-size="getConstraints.guide.minSize"
							:max-size="getConstraints.guide.maxSize"
						>
							<LazyGuide />
						</pane>
						<pane
							v-if="showCode"
						>
							<LazyCode
								:size.sync="sizes.code"
								:min-size="getConstraints.code.minSize"
								:max-size="getConstraints.code.maxSize"
							/>
						</pane>
						<pane
							v-if="!showCode && showLive"
						>
							<LazyLive
								:size.sync="sizes.live"
								:min-size="getConstraints.live.minSize"
								:max-size="getConstraints.live.maxSize"
							/>
						</pane>
					</splitpanes>
				</pane>
			</splitpanes>
		</pane>
		<pane
			:size="sizes.output"
			:min-size="getConstraints.output.minSize"
			:max-size="getConstraints.output.maxSize"
		>
			<LazyOutput
				:sizes="sizes.output"
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
	SET_LIVE_ACTIVE,
	ACTIVE,
	STOP_LIVE,
	CONTAINER_ID,
} from '@/store/live/constants';
import {
	VIEW_MODULE,
	SET_PANE_SIZES,
	MOBILE,
} from '@/store/view/constants';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

let KEEPALIVE_INTERVAL_ID;

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
		}
		catch (err) {
			console.error('FETCH', err);
		}
	},
	fetchOnServer: false,
	data () {
		return {
			banana: 64,
			sizes: {
				example: 64,
				topic: 15,
				guide: 100,
				code: 0,
				live: 0,
				output: 33,
			},
		};
	},
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
			containerId: CONTAINER_ID,
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
		getConstraints () {
			if (this.mobile) {
				return {
					examples: { minSize: 100, maxSize: 100 },
					topic: { minSize: 1, maxSize: 1 },
					guide: { minSize: 0, maxSize: 0 },
					code: { minSize: 0, maxSize: 0 },
					live: { minSize: 0, maxSize: 0 },
					output: { minSize: 100, maxSize: 100 },
				};
			}
			else {
				return {
					examples: { minSize: 20, maxSize: 80 },
					topic: { minSize: 10, maxSize: 40 },
					guide: { minSize: 20, maxSize: 80 },
					code: { minSize: 20, maxSize: 80 },
					live: { minSize: 20, maxSize: 80 },
					output: { minSize: 20, maxSize: 80 },
				};
			}
		},
	},
	watch: {
		mobile (newVal) {
			if (newVal) {
				this.sizes = {
					examples: 100,
					topic: 1,
					guide: 100,
					code: 20,
					live: 20,
					output: 20,
				};
			}
			else {
				this.sizes = {
					examples: 64,
					topic: 15,
					guide: 100,
					code: 0,
					live: 0,
					output: 33,
				};
			}
		},
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
				this.setLiveActive({ active: live });
				this.fetchCode({ code });
				!this.containerId && this.fetchLive({ live });
			},
		},
		containerId: {
			handler (newVal) {
				const HOST = document.location.host;
				const PROTOCOL = location.protocol === 'https:' ? 'wss://' : 'ws://';
				const WEBSOCKET_URL = `${ PROTOCOL }${ HOST }${ process.env.WEBSOCKET_URL }`;
				if (newVal) {
					// connect websocket using the container id
					this.$connect(`${ WEBSOCKET_URL }run/events/${ newVal }`, {
						format: 'json',
					});

					// start keepalive messages every 60 seconds
					this.startKeepalive();
				}
			},
		},
	},
	async beforeMount () {
		window.addEventListener('beforeunload', await this.onPageClose);
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
			setLiveActive: SET_LIVE_ACTIVE,
			stopLive: STOP_LIVE,
		}),
		onPageClose () {
			this.stopKeepalive();
		},
		onResizeFourthPane(data) {
			this.setPaneSizes({
				output: data && data[1] && data[1].size,
			});
		},
		startKeepalive (n = 15) {
			try {
				this.stopKeepalive();
				KEEPALIVE_INTERVAL_ID = setInterval(async () => {
					await this.$socket.sendObj({});
				}, 1 * (n || 15) * 1000);
			}
			catch (err) {
				console.error(err);
			}
		},
		stopKeepalive () {
			try {
				clearInterval(KEEPALIVE_INTERVAL_ID);
			}
			catch (err) {
				console.error(err);
			}
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
	height: 100% !important;
	max-height: 100% !important;
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
