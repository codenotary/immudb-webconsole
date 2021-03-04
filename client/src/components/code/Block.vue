<template>
	<v-container
		id="CodeBlock"
		class="code-blocks"
	>
		<v-row
			class="ma-0 pa-0 justify-stretch align-start"
		>
			<v-col
				class="ma-0 pa-0"
				cols="12"
				sm="12"
				:md="full ? 12 : 10"
				:lg="full ? 12 : 8"
			>
				<prism-editor
					v-model="code"
					class="code command ma-0 mb-2 py-0 px-2 fill-width"
					language="python"
					:plugins="plugins"
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
		full: { type: Boolean, deafault: '' },
	},
	data () {
		return {
			plugins: [
				'command-line',
				'match-braces',
				'line-highlight',
				'line-numbers',
				'show-language',
			],
		};
	},
};
</script>

<style lang="scss">

.code-blocks {
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
			pointer-events: none;

			&.code {
				user-select: none !important;

				&.install {
					min-height: 40px !important;
				}

				&.command {
					min-height: 80px !important;
				}
			}
		}
	}
}
</style>
