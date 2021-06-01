<template>
	<v-card
		v-if="data"
		class="metrics-card ma-0 pa-4 pt-2 bg fill-width"
	>
		<v-card-title class="ma-0 mb-2 pa-0">
			<span
				class="ma-0 mb-2 pa-0 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('metrics.readAndWrite.title', {
					reserved: getMemoryReserved,
					inUse: getMemoryInUse }) }}
			</span>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 fill-width"
		>
			<UiChartLine
				ref="uiChartLine"
				:chart-data="chartdata"
				:options="options"
				:style="styles"
			/>
			<div
				v-if="noData"
				class="chart-no-data d-flex justify-center align-center"
			>
				<span
					class="subtitle-2"
					:class="{
						'gray--text text--lighten-1': !$vuetify.theme.dark,
						'gray--text text--darken-1': $vuetify.theme.dark,
					}"
				>
					No data
				</span>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	THEME,
	MOBILE,
} from '@/store/view/constants';
import {
	DEFAULT_DB,
} from '@/store/database/constants';
import {
	MEMORY_RESERVED,
	MEMORY_IN_USE,
} from '@/store/metrics/constants';
import {
	mdiInformationOutline,
} from '@mdi/js';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';

const ANIMATION_DURATION = 1000;

const CHART_COLORS = {
	BACKGROUND: {
		light: [
			'rgba(76,	175,	80,		0.25)',	// success
			'rgba(124,	77,		255,	0.25)',	// accent
			'rgba(255,	82,		82,		0.25)',	// error
			'rgba(251,	140,	0,		0.25)',	// warning
			'rgba(32,	162,	219,	0.25)',	// primary
		],
		dark: [
			'rgba(76,	175,	80,		0.15)',	// success
			'rgba(124,	77,		255,	0.15)',	// accent
			'rgba(255,	82,		82,		0.15)',	// error
			'rgba(251,	140,	0,		0.15)',	// warning
			'rgba(32,	162,	219,	0.15)',	// primary
		],
	},
	BORDER: {
		light: [
			'rgba(76,	175,	80,		0.95)',	// success
			'rgba(124,	77,		255,	0.95)',	// accent
			'rgba(255,	82,		82,		0.95)',	// error
			'rgba(251,	140,	0,		0.95)',	// warning
			'rgba(32,	162,	219,	0.95)',	// primary
		],
		dark: [
			'rgba(76,	175,	80,		0.75)',	// success
			'rgba(124,	77,		255,	0.75)',	// accent
			'rgba(255,	82,		82,		0.75)',	// error
			'rgba(251,	140,	0,		0.75)',	// warning
			'rgba(32,	162,	219,	0.75)',	// primary
		],
	},
	POINT: {
		light: 'rgba(0, 0, 0, 0.25)',
		dark: 'rgba(255, 255, 255, 0.15)',
	},
	GRID: {
		light: 'rgba(0, 0, 0, 0.25)',
		dark: 'rgba(255, 255, 255, 0.15)',
	},
};

export default {
	name: 'MemoryUsage',
	props: {
		data: { type: Object, default: () => {} },
		database: { type: String, default: DEFAULT_DB },
		steps: { type: Number, default: 6 },
		threshold: { type: Number, default: 6 },
		filled: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiInformationOutline,
			styles: {
				height: `${ 360 }px`,
				position: 'relative',
			},
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			theme: THEME,
			mobile: MOBILE,
		}),
		noData () {
			return (this.reservedY && this.reservedY.length <= 0) &&
				(this.inUseY && this.inUseY.length <= 0);
		},
		help () {
			if (this.data) {
				const { help } = this.data;
				return help && help.replace(/.$/g, '');
			}
			return '';
		},
		label () {
			if (this.data) {
				const { items } = this.data;
				if (items) {
					const { db } = items
							.find(_ => _ && _.db === this.database) || {};
					return db;
				}
				return '';
			}
			return '';
		},
		reservedY () {
			if (this.data && this.data[MEMORY_RESERVED] &&
				this.data[MEMORY_RESERVED].length) {
				return this.data[MEMORY_RESERVED]
						.slice(-this.threshold)
						.map(_ => _ && _.y);
			}
			return [];
		},
		inUseY () {
			if (this.data && this.data[MEMORY_IN_USE] &&
				this.data[MEMORY_IN_USE].length) {
				return this.data[MEMORY_IN_USE]
						.slice(-this.threshold)
						.map(_ => _ && _.y);
			}
			return [];
		},
		reservedX () {
			if (this.data && this.data[MEMORY_RESERVED] &&
				this.data[MEMORY_RESERVED].length) {
				return this.data[MEMORY_RESERVED]
						.slice(-this.threshold)
						.map(_ => _ && _.x);
			}
			return [];
		},
		inUseX () {
			if (this.data && this.data[MEMORY_IN_USE] &&
				this.data[MEMORY_IN_USE].length) {
				return this.data[MEMORY_IN_USE]
						.slice(-this.threshold)
						.map(_ => _ && _.x);
			}
			return [];
		},
		getMemoryReserved () {
			if (this.chartdata.datasets[0]) {
				return prettyBytes(parseInt(this.chartdata.datasets[0].data) || 0);
			}
			return '';
		},
		getMemoryInUse () {
			if (this.chartdata.datasets[1]) {
				return prettyBytes(parseInt(this.chartdata.datasets[1].data) || 0);
			}
			return '';
		},
		getMaxReservedSteps () {
			const max = Math.max.apply(Math, this.reservedY) * 1.5;
			return this.roundToNearest(Math.round(max), Math.floor(max / this.steps));
		},
		getMaxInUseSteps () {
			const max = Math.max.apply(Math, this.inUseY) * 1.5;
			return this.roundToNearest(Math.round(max), Math.floor(max / this.steps));
		},
		chartdata () {
			return {
				labels: this.reservedX,
				datasets: [
					{
						label: this.$t('metrics.memoryUsage.reserved.label'),
						data: this.reservedY,
						fill: this.filled,
						lineTension: 0.2,
						pointRadius: 4,
						backgroundColor: CHART_COLORS.BACKGROUND[this.theme][1],
						borderColor: CHART_COLORS.BORDER[this.theme][1],
						pointBackgroundColor: CHART_COLORS.POINT[this.theme],
					},
					{
						label: this.$t('metrics.memoryUsage.inUse.label'),
						data: this.inUseY,
						fill: this.filled,
						lineTension: 0.2,
						pointRadius: 4,
						backgroundColor: CHART_COLORS.BACKGROUND[this.theme][2],
						borderColor: CHART_COLORS.BORDER[this.theme][2],
						pointBackgroundColor: CHART_COLORS.POINT[this.theme],
					},
				],
			};
		},
		options () {
			const getMaxReservedSteps = this.getMaxReservedSteps;
			const getMaxInUseSteps = this.getMaxInUseSteps;
			return {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					display: true,
					position: 'bottom',
					height: 64,
					labels: {
						padding: 16,
					},
				},
				scales: {
					yAxes: [{
						stacked: false,
						ticks: {
							callback (value) {
								return prettyBytes(parseInt(value) || 0);
							},
							maxTicksLimit: this.steps,
							minTicksLimit: this.steps / 2,
							padding: 16,
							min: 0,
							max: Math.max(getMaxReservedSteps, getMaxInUseSteps),
						},
						gridLines: {
							display: true,
							color: CHART_COLORS.GRID[this.theme],
						},
					}],
					xAxes: [{
						stacked: true,
						ticks: {
							callback (value) {
								return moment(value).format('hh:mm:ss A');
							},
							padding: 16,
						},
						gridLines: {
							display: true,
							color: CHART_COLORS.GRID[this.theme],
						},
					}],
				},
				tooltips: {
					callbacks: {
						title (tooltipItem, data) {
							return data.datasets[0].label;
						},
						label (tooltipItem) {
							const { xLabel, yLabel } = tooltipItem;
							const y = moment(xLabel)
									.format('hh:mm:ss A');
							const x = prettyBytes(parseInt(yLabel) || 0);
							return `${ y }: ${ x }`;
						},
					},
				},
				animation: {
					duration: this.mobile
						? 0
						: ANIMATION_DURATION,
				},
				hover: {
					animationDuration: this.mobile
						? 0
						: ANIMATION_DURATION,
				},
				responsiveAnimationDuration: this.mobile
					? 0
					: ANIMATION_DURATION,
			};
		},
	},
	methods: {
		roundToNearest (numToRound, numToRoundTo) {
			return Math.round(numToRound / numToRoundTo) * numToRoundTo;
		},
	},
};
</script>

<style lang="scss">
.metrics-card {
	.stack-sheet {
		position: relative;
		min-height: 208px;
		height: auto;
	}

	.stack-spark {
		position: absolute;
		top: 0;
		left: 0;
	}

	> div {
		height: inherit;
	}

	.chart-no-data {
		position: absolute;
		height: 32px;
		width: 160px;
		top: calc(170px - 8px);
		left: calc(50% - 80px);
	}
}
</style>
