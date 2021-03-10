<template>
	<div
		id="OutputCode"
		class="ma-0 pa-0 px-1 fill-height"
	>
		<div
			v-if="output && output.length"
		>
			<OutputCodeFilter
				id="CodeFilter"
				:filter.sync="filter"
			/>
			<OutputCodeItem
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
	name: 'OutputCode',
	props: {
		emptyMessage: { type: String, default: 'output.stdout.empty' },
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
			return this.output.filter((_) => {
				return (this.filter === 'all') ||
					(_ && _.flux === this.filter);
			});
		},
	},
};
</script>

<style lang="scss">
#OutputCode {
	#CodeFilter {
		position: absolute;
		top: $spacer-2;
		right: $spacer-2;
		width: 96px;
	}
}
</style>
