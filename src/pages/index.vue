<template>
	<v-card
		id="Metrics"
		class="ma-0 pa-0 pr-4 bg fill-height pane shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 pl-1 pr-0 d-flex justify-start align-center">
			<v-icon
				class="ml-2"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiChartBoxOutline }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 pt-1 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('metrics.title') }}
			</h4>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-4 bg-secondary fill-height custom-scrollbar"
		>
			<v-row class="ma-0 pa-0 d-flex flex-wrap justify-start align-start">
				<v-col
					class="ma-0 mb-4 pa-0 pr-md-2"
					cols="12"
					sm="12"
					md="6"
					lg="4"
				>
					<MetricsCard
						title="Metrics 1"
						:items="items1"
					/>
				</v-col>
				<v-col
					class="ma-0 mb-4 pa-0 pl-md-2"
					cols="12"
					sm="12"
					md="6"
					lg="4"
				>
					<MetricsCard
						title="Metrics 2"
						:items="items2"
					/>
				</v-col>
				<v-col
					class="ma-0 mb-4 pa-0"
					cols="12"
					sm="12"
				>
					<MetricsCard
						title="Metrics 3"
						:items="items3"
					/>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import {
	mdiChartBoxOutline,
} from '@mdi/js';

export default {
	name: 'Metrics',
	data () {
		return {
			mdiChartBoxOutline,
			items1: [
				{
					label: 'value 1',
					color: '#ccc',
					value: this.getRandomValues(16),
				},
				{
					label: 'value 2',
					color: 'red',
					value: this.getRandomValues(16),
				},
			],
			items2: [
				{
					label: 'value 1',
					color: '#ccc',
					value: this.getRandomValues(12),
				},
			],
			items3: [
				{
					label: 'value 1',
					color: 'blue',
					value: this.getRandomValues(32),
				},
			],
		};
	},
	methods: {
		getRandomValues (data) {
			return Array.from({ length: data }, () => Math.floor(Math.random() * data));
		},
	},
};
</script>

<style lang="scss">
#Users {
	&.pane {
		&::after {
			content: '';
			position: absolute;
			top: calc(#{$spacer-12} + 1px);
			right: calc(#{$spacer-4} + 1px);
			bottom: 0;
			left: 1px;
			pointer-events: none !important;
		}

		&.theme-- {
			&light {
				&::after {
					outline: 1px solid rgba(0, 0, 0, 0.05);
				}
			}
		}
	}
}
</style>
