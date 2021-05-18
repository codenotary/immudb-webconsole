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
				{{ title }}: {{ getDatabaseSize }}
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
	mdiInformationOutline,
} from '@mdi/js';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';

const ANIMATION_DURATION = 1000;

const CHART_COLORS = {
	light: [
		'rgba(76,	175,	80,		0.75)',	// success
		'rgba(124,	77,		255,	0.75)',	// accent
		'rgba(255,	82,		82,		0.75)',	// error
		'rgba(251,	140,	0,		0.75)',	// warning
		'rgba(32,	162,	219,	0.75)',	// primary
	],
	dark: [
		'rgba(76,	175,	80,		0.55)',	// success
		'rgba(124,	77,		255,	0.55)',	// accent
		'rgba(255,	82,		82,		0.55)',	// error
		'rgba(251,	140,	0,		0.55)',	// warning
		'rgba(32,	162,	219,	0.55)',	// primary
	],
};

const POINT_COLORS = {
	light: 'rgba(0, 0, 0, 0.25)',
	dark: 'rgba(255, 255, 255, 0.15)',
};

const GRID_COLORS = {
	light: 'rgba(0, 0, 0, 0.25)',
	dark: 'rgba(255, 255, 255, 0.15)',
};

export default {
	name: 'DbSize',
	props: {
		data: { type: Object, default: () => {} },
		database: { type: String, default: DEFAULT_DB },
		period: { type: [String, Number], default: 3000 },
		steps: { type: Number, default: 12 },
		threshold: { type: Number, default: 12 },
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
		title () {
			if (this.data) {
				const { title } = this.data;
				return title && title.replace(/.$/g, '');
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
			if (this.chartdata.datasets[0]) {
				return prettyBytes(parseInt(this.chartdata.datasets[0].data) || 0);
			}
			return '';
		},
		chartdata () {
			return {
				labels: this.x,
				datasets: [
					{
						label: this.label,
						data: this.y,
						fill: true,
						lineTension: 0.2,
						pointRadius: 4,
						backgroundColor: CHART_COLORS[this.theme],
						pointBackgroundColor: POINT_COLORS[this.theme],
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
						stacked: true,
						ticks: {
							callback (value) {
								return prettyBytes(parseInt(value) || 0);
							},
							maxTicksLimit: this.steps,
							minTicksLimit: this.steps / 2,
							padding: 16,
							min: 0,
							max: getMaxSteps(true),
						},
						gridLines: {
							display: true,
							color: GRID_COLORS[this.theme],
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
							color: GRID_COLORS[this.theme],
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
		getMaxSteps (offset = true) {
			const max = Math.max.apply(Math, this.y) * 1.5;
			return this.roundToNearest(Math.round(max), Math.floor(max / this.steps));
		},
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