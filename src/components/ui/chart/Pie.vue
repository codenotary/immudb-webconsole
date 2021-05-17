<script>
/* eslint-disable vue/require-prop-types */

import { Pie, mixins } from 'vue-chartjs';

export default {
	name: 'UiChartPie',
	extends: Pie,
	mixins: [mixins.reactiveProp],
	props: ['chartData', 'options'],
	mounted () {
		this.renderChart(this.chartData, this.options);
	},
};
</script>
