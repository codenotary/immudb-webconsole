<template>
	<v-card
		id="Output"
		class="ma-0 pa-0 bg shadow fill-height"
		elevation="0"
	>
		<v-card-title class="ma-0 pa-0 d-flex justify-start align-center">
			<OutputSubNavbar
				:tab.sync="tab"
				:tab-has-updates.sync="tabHasUpdates"
			/>
		</v-card-title>
		<v-card-text class="ma-0 pa-2 bg-secondary custom-scrollbar">
			<OutputCode
				v-if="tab === 0"
				class="ma-0 pa-0"
				:empty-message="'output.code.empty'"
			/>
			<OutputMerkleTree
				v-else-if="tab === 1"
				class="ma-0 pa-0"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import {
	OUTPUT_MODULE,
	CODE_OUTPUT,
	MERKLE_TREE,
} from '@/store/output/constants';
import { mdiViewList } from '@mdi/js';
const isEqual = require('lodash.isequal');

export default {
	name: 'Output',
	data () {
		return {
			mdiViewList,
			tab: 0,
			tabHasUpdates: [0, 0],
		};
	},
	computed: {
		...mapGetters(OUTPUT_MODULE, {
			output: CODE_OUTPUT,
			merkleTree: MERKLE_TREE,
		}),
	},
	watch: {
		output: {
			deep: true,
			handler (newVal, oldVal) {
				if (this.tab !== 0 && !isEqual(newVal, oldVal)) {
					Vue.set(this.tabHasUpdates, 0, this.tabHasUpdates[0] + 1);
				}
			},
		},
		'merkleTree.graph': {
			deep: true,
			handler (newVal, oldVal) {
				if (this.tab !== 1 && !isEqual(newVal, oldVal)) {
					Vue.set(this.tabHasUpdates, 1, this.tabHasUpdates[1] + 1);
				}
			},
		},
	},
};
</script>

<style lang="scss">
#Output {
	&.v-card {
		.v-card__text {
			overflow-y: auto;
			overflow-x: hidden;
		}
	}
}
</style>
