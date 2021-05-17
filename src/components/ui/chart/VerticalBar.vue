<script>
/* eslint-disable vue/require-prop-types */

import { Bar, mixins } from 'vue-chartjs';

export default {
	name: 'UiChartVerticalBar',
	extends: Bar,
	mixins: [mixins.reactiveProp],
	props: ['chartData', 'options'],
	mounted () {
		this.renderChart(this.chartData, this.options);
	},
};
</script>
