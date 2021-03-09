<template>
	<v-card
		id="Output"
		class="ma-0 pt-0 pb-1 px-1 bg shadow fill-height"
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
				:output="output || []"
				:empty-message="'output.code.empty'"
			/>
			<OutputMerkleTree
				v-else-if="tab === 1"
				class="ma-0 pa-0"
				:merkle-tree="merkleTree || []"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import {
	CODE_MODULE,
	CODE_OUTPUT,
	MERKLE_TREE,
} from '@/store/code/constants';
import { mdiViewList } from '@mdi/js';
const isEqual = require('lodash.isequal');

export default {
	name: 'Output',
	data () {
		return {
			mdiViewList,
			tab: 0,
			tabHasUpdates: [false, false],
		};
	},
	computed: {
		...mapGetters(CODE_MODULE, {
			output: CODE_OUTPUT,
			merkleTree: MERKLE_TREE,
		}),
	},
	watch: {
		output: {
			deep: true,
			handler (newVal, oldVal) {
				if (!isEqual(newVal, oldVal)) {
					Vue.set(this.tabHasUpdates, 0, true);
				}
			},
		},
		merkleTree: {
			deep: true,
			handler (newVal, oldVal) {
				if (!isEqual(newVal, oldVal)) {
					Vue.set(this.tabHasUpdates, 1, true);
				}
			},
		},
	},
};
</script>

<style lang="scss">
#Output {
	min-height: 100% !important;

	&.v-card {
		.v-card__text {
			height: calc(100% - 44px) !important;
			overflow-y: auto;
			overflow-x: hidden;
		}
	}
}
</style>
