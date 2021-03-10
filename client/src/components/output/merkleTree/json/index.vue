<template>
	<span
		class="body-2"
	>
		<no-ssr>
			<vue-json-pretty
				:data="json"
				:deep="3"
				:virtual="true"
				:show-line="true"
				:collapsed-on-click-brackets="true"
			/>
		</no-ssr>
	</span>
</template>

<script>
import NoSSR from 'vue-no-ssr';

export default {
	name: 'OutputMerkleTreeJson',
	components: {
		'no-ssr': NoSSR,
	},
	props: {
		json: { type: Array, default: () => {} },
	},
};
</script>
