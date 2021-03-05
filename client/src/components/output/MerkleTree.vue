<template>
	<div
		id="OutputMerkleTree"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="!merkleTree"
			class="ma-4 pa-0"
		>
			<span class="body-2">
				There is no merkle tree yet...
			</span>
		</div>
		<div
			v-else
			class="ma-4 pa-0 custom-scrollbar"
		>
			<span class="body-2">
				{{ merkleTree }}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OutputMerkleTree',
	props: {
		merkleTree: { type: Array, default: () => {} },
	},
};
</script>
