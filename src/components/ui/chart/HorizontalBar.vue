<script>
/* eslint-disable vue/require-prop-types */

import { HorizontalBar, mixins } from 'vue-chartjs';

export default {
	name: 'UiChartHorizontalBar',
	extends: HorizontalBar,
	mixins: [mixins.reactiveProp],
	props: ['chartData', 'options'],
	mounted () {
		this.renderChart(this.chartData, this.options);
	},
};
</script>
