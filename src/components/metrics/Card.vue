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
				{{ title }}
			</span>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 fill-width"
		>
			<v-sheet
				class="stack-sheet fill-width"
				color="rgba(0, 0, 0, .12)"
			>
				<v-sparkline
					v-for="(item, idx) in items"
					:key="idx"
					class="stack-spark fill-height fill-width"
					:value="item.value"
					:color="item.color"
					:padding="16"
					:line-width="2"
					:smooth="1"
					auto-draw
				>
					<template #label="_">
						<template
							v-if="idx === 0"
						>
							{{ _.value }}
						</template>
					</template>
				</v-sparkline>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'MetricsCard',
	props: {
		title: { type: String, default: '' },
		items: { type: Array, default: () => [] },
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
