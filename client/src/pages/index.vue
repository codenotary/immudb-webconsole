<template>
	<splitpanes
		class="playground-theme"
		horizontal
		:push-other-panes="false"
	>
		<pane
			min-size="20"
			max-size="100"
		>
			<splitpanes
				:push-other-panes="false"
				:horizontal="mobile"
				@resize="resizeFirstPanes"
			>
				<pane
					v-if="!mobile"
					:size="getFirstPane.size"
					:min-size="getFirstPane.minSize"
					:max-size="getFirstPane.maxSize"
				>
					<NavigationExamples />
				</pane>
				<pane>
					<Code
						:size="getSecondPane.size"
						:code-path="codePath"
					/>
				</pane>
			</splitpanes>
		</pane>
		<pane
			:size="getThirdPane.size"
			:min-size="getThirdPane.minSize"
			:max-size="getThirdPane.maxSize"
		>
			<Output />
		</pane>
	</splitpanes>
</template>

<script>
import { mapGetters } from 'vuex';
import LayoutMixin from '@/mixins/LayoutMixin';
import { ParamMixin, PARAMS } from '@/mixins/ParamMixin';
import { title } from '@/helpers/meta';
import {
	VIEW_MODULE,
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
	data: () => ({
		navPaneSizes: 20,
		codePaneSizes: 80,
		outputPaneSizes: 40,
		codePath: '',
	}),
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
		}),
		getFirstPane () {
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
		getSecondPane () {
			if (this.mobile) {
				return {
					size: 100,
					minSize: 100,
					maxSize: 100,
				};
			}
			return {
				size: 80,
				minSize: 60,
				maxSize: 80,
			};
		},
		getThirdPane () {
			if (this.mobile) {
				return {
					size: 20,
					minSize: 60,
					maxSize: 100,
				};
			}
			return {
				size: 20,
				minSize: 60,
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
	},
	mounted () {
		// track google analytics pageview
		this.$gtag.pageview({
			page_title: 'Dashboard',
			page_location: window && window.location && window.location.href,
			page_path: '/',
		});

		this.codePath = this.getParam(PARAMS.CODE) || '/python/hello_world';
	},
	methods: {
		resizeFirstPanes (data) {
			this.navPaneSizes = data && data[0].size;
			this.codePaneSizes = data && data[1].size;
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
			min-width: 8px;
			position: relative;

			&:hover {
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
					left: -4px !important;
					transform: translateY(-50%) translateX(0%) rotate(0deg) !important;
				}
			}
		}
	}
}
</style>
