<template>
	<v-container
		id="CodeBlock"
		class="code-block"
	>
		<v-row
			class="ma-0 pa-0 justify-stretch align-start fill-width"
		>
			<v-col
				class="ma-0 pa-0"
				cols="12"
			>
				<prism-editor
					v-model="editableCode"
					class="code command ma-0 mb-2 py-0 px-2 fill-width"
					language="python"
					line-numbers
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'Block',
	props: {
		code: { type: String, default: '' },
		full: { type: Boolean, deafault: false },
	},
	data () {
		return {
			editableCode: '',
			plugins: [
				'command-line',
				'match-braces',
				'line-highlight',
				'line-numbers',
				'show-language',
			],
		};
	},
	watch: {
		editableCode: {
			deep: true,
			immediate: false,
			handler (newVal, oldVal) {
				if (newVal !== oldVal) {
					this.$emit('update', newVal);
				}
			},
		},
	},
	mounted () {
		this.editableCode = this.code;
	},
};
</script>

<style lang="scss">

.code-block {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	min-height: 100%;

	.v-card__title {
		height: 64px;
		width: 100% !important;
	}

	.v-card__text {
		position: relative;
	}

	.prism-editor-wrapper {
		overflow: hidden !important;
	}
}
</style>
