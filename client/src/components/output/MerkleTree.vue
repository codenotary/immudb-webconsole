<template>
	<div
		id="OutputMerkleTree"
		class="ma-0 py-2 px-2 px-1 fill-height"
	>
		<span
			v-if="!merkleTree"
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
export default {
	name: 'OutputMerkleTree',
	props: {
		merkleTree: { type: String, default: '' },
	},
};
</script>
