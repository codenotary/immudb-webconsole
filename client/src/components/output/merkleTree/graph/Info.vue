<template>
	<div class="text-center">
		<v-dialog
			:value="value"
			width="500"
			@click:outside="onClose"
		>
			<v-card class="ma-0 pa-4">
				<v-card-title class="ma-0 mb-4 pa-0">
					<span>
						{{ $t('output.merkleTree.commands.info') }}
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
				<v-card-text class="ma-0 mb-4 pa-0">
					<span
						class="ma-0 pa-0 body-2"
					>
						{{ $t('output.merkleTree.commands.tooltip.info') }}
					</span>
				</v-card-text>
				<v-card-actions class="ma-0 pa-0 d-flex justify-end">
					<v-btn
						class="ma-0 py-0 px-2"
						color="info"
						depressed
						text
						href="https://en.wikipedia.org/wiki/Merkle_tree"
						rel="noopener"
						:alt="$t('common.moreInfo')"
					>
						{{ $t('common.moreInfo') }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import {
	mdiClose,
} from '@mdi/js';

export default {
	name: 'OutputMerkleTreeGraphInfo',
	props: {
		value: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiClose,
		};
	},
	methods: {
		onClose () {
			this.$emit('input', false);
		},
	},
};
</script>
