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
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
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
			mdiInformationOutline,
			styles: {
				height: '350px',
				position: 'relative',
			},
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			mobile: MOBILE,
		}),
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
					display: true,
					position: 'bottom',
					labels: {
						color: 'rgb(255, 99, 132)',
					},
					padding: 32,
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
				plugins: {
					lengend: {
						title: {
							padding: 160,
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
