<template>
	<div
		class="ma-0 py-1 px-0 bg-tertiary d-flex flex-column"
		dense
		tile
	>
		<v-tooltip
			left
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
				{{ $t('output.merkleTree.commands.tooltip.resetZoom') }}
			</span>
		</v-tooltip>
		<v-divider class="my-1 mx-0 pa-0" />
		<v-tooltip
			left
		>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					class="command ma-0 pa-1 bg-tertiary"
					:alt="$t('output.merkleTree.commands.info')"
					small
					depressed
					tile
					v-bind="attrs"
					v-on="on"
					@click="infoModal = !infoModal"
				>
					<v-icon
						class="grey--text text--lighten-1"
					>
						{{ mdiInformationOutline }}
					</v-icon>
				</v-btn>
			</template>
			<span v-html="$t('output.merkleTree.commands.info')" />
		</v-tooltip>
		<OutputMerkleTreeGraphInfo
			v-model="infoModal"
		/>
	</div>
</template>

<script>
import {
	mdiImageFilterCenterFocus,
	mdiInformationOutline,
} from '@mdi/js';

export default {
	name: 'OutputMerkleTreeGraphCommands',
	data () {
		return {
			mdiImageFilterCenterFocus,
			mdiInformationOutline,
			infoModal: false,
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
