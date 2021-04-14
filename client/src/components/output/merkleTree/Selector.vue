<template>
	<v-btn-toggle
		v-model="value"
		color="accent"
		group
		dense
		style="z-index: 5;"
	>
		<v-btn
			class="ma-0 py-0 px-2"
			:value="DEFAULT_MERKLE_TREE_MODE"
			dense
		>
			{{ $t('output.merkleTree.selector.graph') }}
		</v-btn>
		<v-btn
			class="ma-0 py-0 px-2"
			:value="'json'"
			dense
		>
			{{ $t('output.merkleTree.selector.json') }}
		</v-btn>
	</v-btn-toggle>
</template>

<script>
import {
	DEFAULT_MERKLE_TREE_MODE,
} from '@/store/output/constants';

export default {
	name: 'OutputMerkleTreeSelector',
	props: {
		graph: { type: String, default: '' },
	},
	data () {
		return {
			DEFAULT_MERKLE_TREE_MODE,
			value: '',
		};
	},
	watch: {
		graph: {
			immediate: true,
			handler (newVal, oldVal) {
				if (newVal !== oldVal) {
					newVal && (this.value = newVal);
				}
			},
		},
		value (newVal) {
			this.$emit('update', { mode: newVal });
		},
	},
};
</script>
