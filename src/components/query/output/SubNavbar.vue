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
						class="ml-2 subtitle-1"
						:class="{
							'black--text ': !$vuetify.theme.dark,
							'white--text': $vuetify.theme.dark,
						}"
						dense
					>
						{{ mdiGrid }}
					</v-icon>
					<span
						class="ml-2 subtitle-1 font-weight-bold text-capitalize"
						:class="{
							'black--text ': !$vuetify.theme.dark,
							'white--text': $vuetify.theme.dark,
						}"
					>
						<v-badge
							:value="tabHasUpdates[0]"
							color="red lighten-1"
							:content="tabHasUpdates[0]"
							bordered
						>
							{{ $t('query.output.grid.title') }}
						</v-badge>
					</span>
				</v-tab>
			</v-tabs>
		</v-card-text>
	</v-card>
</template>

<script>
import {
	mdiGrid,
	mdiAlertCircleOutline,
} from '@mdi/js';

export default {
	name: 'QueryOutputSubNavbar',
	props: {
		tab: { type: Number, default: 0 },
		tabHasUpdates: { type: Array, default: () => [] },
	},
	data () {
		return {
			mdiGrid,
			mdiAlertCircleOutline,
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
				_tabHasUpdates[data] = 0;
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
		z-index: 2;

		.v-slide-group__content {
			height: $spacer-12 !important;

			.v-tabs-slider-wrapper {
				height: 4px !important;
				z-index: 99 !important;

				.v-tabs-slider {
					position: relative;
				}
			}
		}
	}
}
</style>
