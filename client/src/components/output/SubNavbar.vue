<template>
	<v-card
		class="ma-0 pa-0 fill-width bg"
		tile
		:elevation="0"
	>
		<v-card-text
			class="ma-0 pa-0"
			style="box-shadow: none !important;"
		>
			<v-tabs
				id="OutputSubNavbar"
				v-model="activeTab"
				class="sub-navbar"
				slider-color="primary"
				show-arrows
				dense
			>
				<v-tab
					@click="dismissUpdate(0)"
				>
					<v-icon
						class="ml-2 gray--text text--lighten-1"
						dense
					>
						{{ mdiText }}
					</v-icon>
					<span class="ml-2 body-2 text-capitalize">
						<v-badge
							:value="tabHasUpdates[0]"
							color="red lighten-1"
							:offset-y="-2"
							:offset-x="-2"
							dot
						>
							{{ $t('output.code.title') }}
						</v-badge>
					</span>
				</v-tab>
				<v-tab
					@click="dismissUpdate(1)"
				>
					<v-icon
						class="ml-2 gray--text text--lighten-1"
						dense
					>
						{{ mdiFamilyTree }}
					</v-icon>
					<span class="ml-2 body-2 text-capitalize">
						<v-badge
							:value="tabHasUpdates[1]"
							color="red lighten-1"
							:offset-y="-2"
							:offset-x="-2"
							dot
						>
							{{ $t('output.merkleTree.title') }}
						</v-badge>
					</span>
				</v-tab>
			</v-tabs>
		</v-card-text>
	</v-card>
</template>

<script>
import {
	mdiText,
	mdiAlertCircleOutline,
	mdiFamilyTree,
} from '@mdi/js';

export default {
	name: 'OutputSubNavbar',
	props: {
		tab: { type: Number, default: 0 },
		tabHasUpdates: { type: Array, default: () => [] },
	},
	data () {
		return {
			mdiText,
			mdiAlertCircleOutline,
			mdiFamilyTree,
			activeTab: 0,
		};
	},
	watch: {
		activeTab (newVal) {
			this.$emit('update:tab', newVal);
		},
	},
	methods: {
		dismissUpdate (data) {
			if (this.tabHasUpdates[data]) {
				const _tabHasUpdates = this.tabHasUpdates;
				_tabHasUpdates[data] = false;
				this.$emit('update:tabHasUpdates', _tabHasUpdates);
			}
		},
	},
};
</script>

<style lang="scss">
#OutputSubNavbar {
	background-color: inherit !important;

	.v-item-group {
		background-color: inherit !important;

		.v-tabs-slider-wrapper {
			height: 4px !important;

			.v-tabs-slider {
				position: relative;
			}
		}
	}
}
</style>
