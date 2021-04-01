<template>
	<div
		class="ma-0 pa-0 d-flex flex-column"
		dense
	>
		<v-simple-table>
			<template v-slot:default>
				<thead>
					<tr>
						<th class="ma-0 py-0 px-4 subtitle-2 text-left">
							Metrics
						</th>
						<th class="ma-0 py-0 px-4">
							&nbsp;
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="item in parsedItems"
						:key="item.id"
						class="ma-0 pa-0"
					>
						<td
							class="ma-0 py-0 px-4 caption text-left text-capitalize"
						>
							{{ item && item.label }}
						</td>
						<td
							v-if="item && item.label === 'verified'"
							class="ma-0 ml-4 py-0 px-4 caption text-right"
						>
							<v-tooltip
								bottom
							>
								<template v-slot:activator="{ on, attrs }">
									<div
										v-bind="attrs"
										v-on="on"
									>
										<v-chip
											class="ma-0 py-0 px-2 outlined"
											:color="item.value ? 'success' : 'error'"
											dense
											small
										>
											{{ $t(`output.metrics.${ item.value
												? 'verified'
												: 'notVerified'
											}`) }}
										</v-chip>
									</div>
								</template>
								<span>
									{{ $t(`output.metrics.tooltip.${ item.value
										? 'verified'
										: 'notVerified'
									}`) }}
								</span>
							</v-tooltip>
						</td>
						<td
							v-else-if="item"
							class="ma-0 py-0 px-4 caption text-right"
						>
							{{ item && item.value }}
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
import { mdiImageFilterCenterFocus } from '@mdi/js';

export default {
	name: 'OutputMerkleTreeGraphMetrics',
	props: {
		metrics: { type: Object, default: () => {} },
	},
	data () {
		return {
			mdiImageFilterCenterFocus,
		};
	},
	computed: {
		parsedItems () {
			if (this.metrics) {
				return Object.entries(this.metrics)
						.map((_, idx) => {
							return {
								id: idx,
								label: _[0],
								value: _[1],
							};
						});
			}
			return [];
		},
	},
	methods: {
		onResetZoom () {
			this.$emit('resetZoom');
		},
	},
};
</script>

<style lang="scss">
#MerkleTreeGraphMetrics {
	border-radius: 4px !important;
	overflow: hidden;

	.v-data-table {
		&.theme-- {
			&dark {
				background: rgba(255, 255, 255, 0.05);
			}

			&light {
				background: rgba(0, 0, 0, 0.05);
			}
		}

		thead,
		tbody {
			&,
			tr {
				background: transparent;
			}
		}
	}
}
</style>
