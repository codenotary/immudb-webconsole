<template>
	<v-btn-toggle
		color="accent"
		dense
		tile
	>
		<v-tooltip
			right
		>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					class="ma-0 py-0 px-2"
					small
					icon
					:title="$t('output.merkleTree.commands.resetZoom')"
					:alt="$t('output.merkleTree.commands.resetZoom')"
					v-bind="attrs"
					v-on="on"
					@click="onResetZoom"
				>
					<v-icon
						class="title"
						color="white darken-1"
					>
						{{ mdiImageFilterCenterFocus }}
					</v-icon>
				</v-btn>
			</template>
			<span>
				{{ $t('output.merkleTree.commands.resetZoom') }}
			</span>
		</v-tooltip>
	</v-btn-toggle>
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
