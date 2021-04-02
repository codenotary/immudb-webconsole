<template>
	<v-card
		id="MerkleTreeaphModal"
		class="ma-0 pa-4 pt-2 bg"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-start align-center">
			<v-icon>
				{{ mdiPound }}
			</v-icon>
			<span class="ml-2 subtitle-2">
				{{ title }}
			</span>
			<v-spacer />
		</v-card-title>
		<v-card-text
			class="ma-0 pa-4 bg-secondary custom-scrollbar"
		>
			<no-ssr>
				<vue-json-pretty
					:data="item"
					:deep="3"
					:virtual="true"
					:show-line="true"
					:collapsed-on-click-brackets="true"
				/>
			</no-ssr>
		</v-card-text>
	</v-card>
</template>

<script>
import { mdiPound } from '@mdi/js';

export default {
	name: 'OutputMerkleTreeGraphPopUp',
	props: {
		item: { type: Object, default: () => {} },
		node: { type: Object, default: () => {} },
	},
	data () {
		return {
			mdiPound,
		};
	},
	computed: {
		title () {
			if (this.item) {
				const { data } = this.item;
				if (data) {
					const { tree } = data;
					return tree;
				}
			}
			return '';
		},
	},
};
</script>

<style lang="scss">
#OutputMerkleTreeGraphModal {
	//
}
</style>
