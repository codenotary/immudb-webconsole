<script>
/* eslint-disable vue/require-prop-types */

import { Line, mixins } from 'vue-chartjs';

export default {
	name: 'UiChartLine',
	extends: Line,
	mixins: [mixins.reactiveProp],
	props: ['chartData', 'options'],
	watch: {
		options() {
			const chart = this.$data._chart;
			chart.options = this.options;
			chart.update({ duration: 30 });
		},
	},
	mounted () {
		this.renderChart(this.chartData, this.options);
	},
};
</script>
