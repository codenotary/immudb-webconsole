<template>
	<v-card
		class="metrics-card ma-0 pa-4 pt-2 bg fill-width"
	>
		<v-card-title class="ma-0 pa-0">
			<span
				class="ma-0 mb-2 pa-0 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ title }}: {{ getMaxValue }}
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
		</v-card-text>
	</v-card>
</template>

<script>
import {
	DEFAULT_DB,
} from '@/store/database/constants';
import {
	mdiInformationOutline,
} from '@mdi/js';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';

const CHART_TYPE = {
	SUMMARY: 'SUMMARY',
	COUNTER: 'COUNTER',
	HISTOGRAM: 'HISTOGRAM',
	GAUGE: 'GAUGE',
};

const CHART_COLORS = [
	'rgba(76,	175,	80,		0.55)',	// success
	'rgba(124,	77,		255,	0.55)',	// accent
	'rgba(255,	82,		82,		0.55)',	// error
	'rgba(251,	140,	0,		0.55)',	// warning
	'rgba(32,	162,	219,	0.55)',	// primary
];

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
			CHART_TYPE,
			mdiInformationOutline,
			styles: {
				height: '350px',
				position: 'relative',
			},
		};
	},
	computed: {
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
		getMaxValue () {
			return prettyBytes(parseInt(this.y) || 0);
		},
		chartdata () {
			return {
				labels: this.x,
				datasets: [
					{
						label: this.label,
						data: this.y,
						fill: true,
						pointRadius: 4,
						backgroundColor: CHART_COLORS,
						pointBackgroundColor: 'rgba(255, 255, 255, 0.3)',
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
					position: 'bottom',
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
							padding: 32,
							min: 0,
							max: getMaxSteps(true),
						},
					}],
					xAxes: [{
						stacked: true,
						ticks: {
							callback (value) {
								return moment(value).format('hh:mm:ss A');
							},
							padding: 0,
						},
					}],
				},
				tooltips: {
					callbacks: {
						label(tooltipItem) {
							const { xLabel, yLabel } = tooltipItem;
							console.log(tooltipItem);
							const y = moment(xLabel).format('YYYY/MM/DD hh:mm A');
							const x = prettyBytes(parseInt(yLabel) || 0);
							return `${ y }: ${ x }`;
						},
					},
				},
			};
		},
	},
	methods: {
		getMaxSteps (offset = true) {
			const max = Math.max(this.y) * 1.5;
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
}
</style>
