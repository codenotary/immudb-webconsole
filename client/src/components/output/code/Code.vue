<template>
	<div
		id="OutputCode"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="output && output.length"
		>
			<OutputCodeItem
				v-for="(item, idx) in parseItems"
				:key="`output-${ idx }`"
				:item="item"
			/>
		</div>
		<div
			v-else
			class="ma-4 pa-0"
		>
			<span
				class="body-2"
			>
				{{ $t(emptyMessage) }}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OutputCode',
	props: {
		output: { type: Array, default: () => {} },
		emptyMessage: { type: String, default: 'output.stdout.empty' },
	},
	data () {
		return {
			plugins: [
				'command-line',
			],
		};
	},
	computed: {
		parseItems () {
			if (this.output) {
				return this.output
						.slice()
						.sort((_) => {
							console.log(_);
							return 1;
						});
			}
			return [];
		},
	},
};
</script>

<style lang="scss">
#OutputCode {
	overflow: hidden;
}
</style>
