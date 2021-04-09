<template>
	<v-dialog
		:value="value"
		width="500"
		@click:outside="onClose"
	>
		<v-card
			id="MerkleTreeaphModal"
			class="ma-0 pa-4 pt-2 bg"
		>
			<v-card-title
				class="ma-0 py-0 px-0 d-flex justify-start align-center"
			>
				<v-icon>
					{{ mdiPound }}
				</v-icon>
				<span class="ml-2 subtitle-2">
					Node detail
				</span>
				<v-spacer />
				<v-btn
					class="ma-0 ml-2 pa-0"
					icon
					@click="onClose"
				>
					<v-icon
						:size="20"
					>
						{{ mdiClose }}
					</v-icon>
				</v-btn>
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
	</v-dialog>
</template>

<script>
import {
	mdiPound,
	mdiClose,
} from '@mdi/js';

export default {
	name: 'OutputMerkleTreeGraphModal',
	props: {
		value: { type: Boolean, default: false },
		item: { type: Object, default: () => {} },
		node: { type: Object, default: () => {} },
	},
	data () {
		return {
			mdiPound,
			mdiClose,
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
	methods: {
		onClose () {
			this.$emit('input', false);
		},
	},
};
</script>

<style lang="scss">
#OutputMerkleTreeGraphModal {
	//
}
</style>
