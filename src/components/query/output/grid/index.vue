<template>
	<div
		id="OutputGrid"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="output && output.length"
		>
			<QueryOutputGridFilter
				id="GridFilter"
				:filter.sync="filter"
			/>
			<QueryOutputGridItem
				v-for="(item, idx) in filterOutput"
				:key="`output-${ idx }`"
				:item="item"
			/>
		</div>
		<div
			v-else
			class="ma-4 pa-0"
		>
			<span
				class="body-2"
			>
				{{ $t(emptyMessage) }}
			</span>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	OUTPUT_MODULE,
	CODE_OUTPUT,
} from '@/store/output/constants';

export default {
	name: 'QueryOutputGrid',
	props: {
		emptyMessage: { type: String, default: 'query.output.empty' },
	},
	data () {
		return {
			filter: 'all',
			plugins: [
				'command-line',
			],
		};
	},
	computed: {
		...mapGetters(OUTPUT_MODULE, {
			output: CODE_OUTPUT,
		}),
		filterOutput () {
			if (this.output && this.output.length) {
				return this.output
						.filter((_) => {
							return (this.filter === 'all') ||
								(_ && _.flux === this.filter);
						});
			}
			return [];
		},
	},
};
</script>

<style lang="scss">
#OutputGrid {
	height: calc(100% - 16px) !important;

	#GridFilter {
		position: absolute;
		top: $spacer-2;
		right: $spacer-2;
		width: 96px;
		z-index: 10;
	}
}
</style>
