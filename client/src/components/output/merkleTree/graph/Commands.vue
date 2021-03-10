<template>
	<div
		class="ma-0 pa-0 d-flex flex-column"
		dense
		tile
	>
		<v-tooltip
			right
		>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					class="command ma-0 pa-1 bg-tertiary"
					:alt="$t('output.merkleTree.commands.resetZoom')"
					small
					depressed
					tile
					v-bind="attrs"
					v-on="on"
					@click="onResetZoom"
				>
					<v-icon
						class="grey--text text--lighten-1"
					>
						{{ mdiImageFilterCenterFocus }}
					</v-icon>
				</v-btn>
			</template>
			<span>
				{{ $t('output.merkleTree.commands.resetZoom') }}
			</span>
		</v-tooltip>
		<v-divider />
	</div>
</template>

<script>
import { mdiImageFilterCenterFocus } from '@mdi/js';

export default {
	name: 'OutputMerkleTreeGraphCommands',
	data () {
		return {
			mdiImageFilterCenterFocus,
		};
	},
	methods: {
		onResetZoom () {
			this.$emit('resetZoom');
		},
	},
};
</script>

<style lang="scss">
#MerkleTreeGraphCommands {
	border-radius: 4px !important;
	overflow: hidden;

	.command {
		min-width: 24px;

		.v-btn__content {
			width: 24px !important;
		}
	}
}
</style>
