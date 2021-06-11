<template>
	<v-card
		v-if="data"
		class="metrics-card ma-0 pa-4 pt-2 bg fill-width"
		elevation="4"
	>
		<v-card-title class="ma-0 mb-2 pa-0">
			<span
				class="ma-0 mb-2 pa-0 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--lighten-2': !$vuetify.theme.dark,
					'gray--text text--lighten-4': $vuetify.theme.dark,
				}"
			>
				{{ $t('metrics.dbSize.title', { size: getDatabaseSize }) }}
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
						'gray--text text--lighten-2': !$vuetify.theme.dark,
						'gray--text text--lighten-4': $vuetify.theme.dark,
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
	mdiInformationOutline,
} from '@mdi/js';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';

const ANIMATION_DURATION = 1000;

const CHART_COLORS = {
	BACKGROUND: {
		light: [
			'rgba(36,	196,	161,	0.25)',	// primary
			'rgba(124,	77,		255,	0.25)',	// accent
			'rgba(192,	107,	111,	0.25)',	// error
			'rgba(126,	198,	153,	0.25)',	// success
			'rgba(240,	141,	73,		0.25)',	// warning
		],
		dark: [
			'rgba(36,	196,	161,	0.15)',	// primary
			'rgba(124,	77,		255,	0.15)',	// accent
			'rgba(192,	107,	111,	0.25)',	// error
			'rgba(126,	198,	153,	0.25)',	// success
			'rgba(240,	141,	73,		0.25)',	// warning
		],
	},
	BORDER: {
		light: [
			'rgba(36,	196,	161,	0.95)',	// primary
			'rgba(124,	77,		255,	0.95)',	// accent
			'rgba(192,	107,	111,	0.25)',	// error
			'rgba(126,	198,	153,	0.25)',	// success
			'rgba(240,	141,	73,		0.25)',	// warning
		],
		dark: [
			'rgba(36,	196,	161,	0.75)',	// primary
			'rgba(124,	77,		255,	0.75)',	// accent
			'rgba(192,	107,	111,	0.25)',	// error
			'rgba(126,	198,	153,	0.25)',	// success
			'rgba(240,	141,	73,		0.25)',	// warning
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
	name: 'DbSize',
	props: {
		data: { type: Object, default: () => {} },
		database: { type: String, default: DEFAULT_DB },
		steps: { type: Number, default: 12 },
		threshold: { type: Number, default: 12 },
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
			return this.y && this.y.length <= 0;
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
		item () {
			if (this.data) {
				const { items } = this.data;
				if (items) {
					return items
							.find(_ => _ && _.db === this.database);
				}
				return {};
			}
			return {};
		},
		y () {
			if (this.item && this.item.values &&
				this.item.values.length) {
				return this.item.values
						.slice(-this.threshold)
						.map(_ => _ && _.y);
			}
			return [];
		},
		x () {
			if (this.item && this.item.values &&
				this.item.values.length) {
				return this.item.values
						.slice(-this.threshold)
						.map(_ => _ && _.x);
			}
			return [];
		},
		getDatabaseSize () {
			if (this.chartdata.datasets[0] && this.chartdata.datasets[0].data) {
				const length = this.chartdata.datasets[0].data.length;
				const lastValue = this.chartdata.datasets[0].data[length - 1];
				return prettyBytes(parseInt(lastValue) || 0);
			}
			return '';
		},
		getMaxSteps () {
			const max = Math.max.apply(Math, this.y) * 1.5;
			return this.roundToNearest(Math.round(max), Math.floor(max / this.steps));
		},
		chartdata () {
			return {
				labels: this.x,
				datasets: [
					{
						label: this.label,
						data: this.y,
						fill: this.filled,
						lineTension: 0.2,
						pointRadius: 4,
						backgroundColor: CHART_COLORS.BACKGROUND[this.theme][0],
						borderColor: CHART_COLORS.BORDER[this.theme][0],
						pointBackgroundColor: CHART_COLORS.POINT[this.theme],
					},
				],
			};
		},
		options () {
			const getMaxSteps = this.getMaxSteps;
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
							max: getMaxSteps,
							fontColor: this.$vuetify.theme.dark
								? '#c9c9c9'
								: '#333',
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
							fontColor: this.$vuetify.theme.dark
								? '#c9c9c9'
								: '#333',
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
							const { datasetIndex: idx } = tooltipItem[0] || {};
							return data.datasets[idx || 0].label;
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
