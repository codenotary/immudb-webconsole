<template>
	<div
		class="guide-code-block ma-0 mb-4 py-2 px-4 bg-code d-flex flex-column justify-space-between align-center"
		:class="`language-${ language }`"
	>
		<span
			v-for="(item, idx) in data"
			:key="idx"
			class="ma-0 pa-0 d-flex flex-row justify-start align-center fill-width"
		>
			<span
				class="ma-0 pa-0 white--text"
				style="width: 33%;"
			>
				{{ item.prompt }}
			</span>
			<span class="ma-0 pa-0 grey--text text--darken-2">
				|
			</span>
			<prism-editor
				class="ma-0 ml-2 pa-0 pr-12"
				:code="item.code.trim()"
				:language="language"
				:readonly="false"
			/>
			<v-btn
				v-if="!run"
				class="copy"
				color="blue lighten-2"
				depressed
				icon
				medium
				@click="onCopy(item.code.trim())"
			>
				<v-icon :size="20">
					{{ mdiContentCopy }}
				</v-icon>
			</v-btn>
		</span>
		<v-btn
			v-if="run"
			class="run"
			color="blue lighten-2"
			depressed
			icon
			@click="onRun"
		>
			<v-icon :size="24">
				{{ mdiPlay }}
			</v-icon>
		</v-btn>
	</div>
</template>

<script>
import {
	mdiContentCopy,
	mdiPlay,
} from '@mdi/js';
import copy from 'copy-to-clipboard';

export default {
	name: 'GuideCode',
	props: {
		language: { type: String, default: 'bash' },
		data: { type: Array, default: () => [] },
		run: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiContentCopy,
			mdiPlay,
		};
	},
	methods: {
		onCopy (data) {
			copy(data);
			this.$toasted.success(`Copied code '${ data }' to clipboard`, { icon: 'check-circle' });
		},
		onRun () {
			console.log('RUN', this.data);
		},
	},
};
</script>

<style lang="scss">
.guide-code-block {
	border-radius: 4px;

	pre {
		padding: 0 !important;

		code {
			min-height: $spacer-4 !important;
		}
	}
}
</style>
