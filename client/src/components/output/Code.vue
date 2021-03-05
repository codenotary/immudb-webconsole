<template>
	<div
		id="OutputCode"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="output && output.length"
		>
			<p
				v-for="(item, idx) in output"
				:key="`output-${ idx }`"
				class="body-2"
			>
				{{ item }}
			</p>
		</div>
		<div
			v-else
			class="ma-4 pa-0"
		>
			<span
				v-for="(item, idx) in output"
				:key="`output-${ idx }`"
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
};
</script>

<style lang="scss">
#OutputCode {
	overflow: hidden;
}
</style>
