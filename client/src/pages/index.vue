<template>
	<splitpanes
		id="PlaygroundTheme"
		class="py-0 pr-4"
		:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
		horizontal
		:push-other-panes="true"
		@resize="onResize({ examples: $event[0], output: $event[1] })"
	>
		<pane
			:size.sync="sizes.examples"
			:min-size="getConstraints.examples.minSize"
			:max-size="getConstraints.examples.maxSize"
		>
			<splitpanes
				:class="`theme--${ $vuetify.theme.dark ? 'dark' : 'light' }`"
				:push-other-panes="true"
				:horizontal="mobile"
				@resize="onResize({ topic: $event[0] })"
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
						@resize="onResize({ guide: $event[0], code: $event[1], live: $event[1] })"
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
							v-if="!showCode && showLive"
						>
							<LazyLive
								:size.sync="sizes.live"
								:min-size="getConstraints.live.minSize"
								:max-size="getConstraints.live.maxSize"
							/>
						</pane>
						<pane
							v-if="!showLive && showCode"
						>
							<LazyCode
								:size.sync="sizes.code"
								:min-size="getConstraints.code.minSize"
								:max-size="getConstraints.code.maxSize"
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
			<!-- S; {{ sizes }} SHOW { CODE: {{ !!showCode }} LIVE: {{ !!showLive }} } -->
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
import WebsocketMessagesMixin from '@/mixins/WebsocketMessagesMixin';
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
	PANE_SIZES,
} from '@/store/view/constants';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

let KEEPALIVE_INTERVAL_ID;

export default {
	name: 'Dashboard',
	layout: 'with-banner',
	components: {
		Splitpanes,
		Pane,
	},
	mixins: [
		LayoutMixin,
		ParamMixin,
		WebsocketMessagesMixin,
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
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
			sizes: PANE_SIZES,
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
					examples: { minSize: 0, maxSize: 100 },
					topic: { minSize: 0, maxSize: 100 },
					guide: { minSize: 0, maxSize: 100 },
					code: { minSize: 0, maxSize: 100 },
					live: { minSize: 0, maxSize: 100 },
					output: { minSize: 0, maxSize: 100 },
				};
			}
		},
	},
	watch: {
		mobile (newVal) {
			if (newVal) {
				this.setPaneSizes({
					examples: 100,
					topic: 1,
					guide: 100,
					code: 20,
					live: 20,
					output: 20,
				});
			}
			else {
				this.setPaneSizes({
					examples: 67,
					topic: 15,
					guide: 100,
					code: 50,
					live: 50,
					output: 33,
				});
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
			immediate: false,
			async handler (newVal) {
				const topicParam = this.getParam(PARAMS.TOPIC) || 'welcome';
				const topic = await this.$content('guides', topicParam).fetch();
				const { code, live } = topic || DEFAULT_TOPIC;
				this.setActiveGuide(topic);
				this.setLiveActive({ active: live });
				this.fetchCode({ code });

				setTimeout(() => {
					// update pane sizes
					this.setPaneSizes({
						guide: code || live ? 50 : 100,
						code: code ? 50 : 0,
						live: live ? 50 : 0,
					});
				}, 30);
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

		!this.containerId && await this.fetchLive();
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
		onResize(data) {
			if (data) {
				const { examples, topic, guide, code, live, output } = data;
				this.setPaneSizes({
					examples: examples ? examples.size : undefined,
					topic: topic ? topic.size : undefined,
					guide: guide ? guide.size : undefined,
					code: code ? code.size : undefined,
					live: live ? live.size : undefined,
					output: output ? output.size : undefined,
				});
			}
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
#PlaygroundTheme {
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
