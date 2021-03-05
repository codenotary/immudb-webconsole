<template>
	<div
		id="OutputMerkleTree"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="merkleTree && merkleTree.length"
			class="ma-4 pa-0 pb-12"
		>
			<span class="body-2">
				<vue-json-pretty
					:data="merkleTree"
					:deep="3"
					:virtual="true"
					:show-line="true"
					:collapsed-on-click-brackets="true"
				/>
			</span>
		</div>
		<div
			v-else
			class="ma-4 pa-0"
		>
			<span class="body-2">
				There is no merkle tree yet...
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

<style lang="scss">
#OutputMerkleTree {
	overflow: hidden;
}
</style>
