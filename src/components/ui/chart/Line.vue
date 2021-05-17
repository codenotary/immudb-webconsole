<script>
/* eslint-disable vue/require-prop-types */

import { Line, mixins } from 'vue-chartjs';

export default {
	name: 'UiChartLine',
	extends: Line,
	mixins: [mixins.reactiveProp],
	props: ['chartData', 'options'],
	mounted () {
		this.renderChart(this.chartData, this.options);
	},
};
</script>
