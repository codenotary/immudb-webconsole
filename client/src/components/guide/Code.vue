<template>
	<div class="guide-code">
		<prism-editor
			class="bg ma-0 mb-2 pa-0"
			:code="code"
			:language="language"
			:readonly="false"
		/>
		<v-btn
			class="copy"
			color="blue lighten-2"
			depressed
			icon
			@click="copyCode(code)"
		>
			<v-icon
				class="ma-0 pa-0"
			>
				{{ mdiContentCopy }}
			</v-icon>
		</v-btn>
	</div>
</template>

<script>
import {
	mdiContentCopy,
} from '@mdi/js';
import copy from 'copy-to-clipboard';

export default {
	name: 'GuideCode',
	props: {
		code: { type: String, default: '' },
		language: { type: String, default: 'go' },
	},
	data () {
		return {
			mdiContentCopy,
		};
	},
	methods: {
		copyCode(data) {
			copy(data);
			this.$toasted.success(`Copied code '${ data }' to clipboard`, { icon: 'check-circle' });
		},
	},
};
</script>

<style lang="scss">
.guide-code {
	position: relative;

	.copy {
		position: absolute;
		display: block;
		top: 2px;
		right: 18px;
		opacity: 0.55;

		&:hover,
		&:active {
			opacity: 1;
		}
	}
}
</style>
