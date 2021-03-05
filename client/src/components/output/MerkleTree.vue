<template>
	<div
		id="OutputMerkleTree"
		class="ma-0 py-2 px-2 px-1 fill-height"
	>
		<span
			v-if="merkleTree"
			class="body-2"
		>
			There is no merkle tree yet...
		</span>
		<span
			v-else
			class="body-2"
		>
			{{ merkleTree }}
		</span>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	CODE_MODULE,
	MERKLE_TREE,
} from '@/store/code/constants';

export default {
	name: 'OutputMerkleTree',
	data () {
		return {
			//
		};
	},
	computed: {
		...mapGetters(CODE_MODULE, {
			merkleTree: MERKLE_TREE,
		}),
	},
};
</script>
