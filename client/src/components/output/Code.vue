<template>
	<div
		id="OutputCode"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="!code"
			class="ma-4 pa-0"
		>
			<span class="body-2">
				{{ $t(emptyMessage) }}
			</span>
		</div>
		<span
			v-else
			class="body-2"
		>
			<prism-editor
				class="code command command-line ma-0 mb-2 pa-0 fill-width"
				:code="code"
				language="python"
				:plugins="plugins"
				data-user="root"
				data-host="host"
				readonly
			/>
		</span>
	</div>
</template>

<script>
export default {
	name: 'OutputCode',
	props: {
		code: { type: String, default: '' },
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
