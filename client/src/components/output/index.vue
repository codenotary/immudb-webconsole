<template>
	<v-card
		id="Output"
		class="ma-0 pt-0 pb-1 px-1 bg fill-height"
		elevation="0"
	>
		<v-card-title class="ma-0 pa-0 d-flex justify-start align-center">
			<OutputSubNavbar
				:tab.sync="tab"
			/>
		</v-card-title>
		<v-card-text class="ma-0 pa-2 bg-secondary fill-height">
			<OutputCode
				v-if="tab === 0"
				class="ma-0 pa-0"
				:code="stdout"
				:empty-message="'output.stdout.empty'"
			/>
			<OutputCode
				v-else-if="tab === 1"
				class="ma-0 pa-0"
				:code="stderr"
				:empty-message="'output.stderr.empty'"
			/>
			<OutputMerkleTree
				v-else-if="tab === 2"
				class="ma-0 pa-0"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	CODE_MODULE,
	CODE_OUTPUT,
} from '@/store/code/constants';
import { mdiViewList } from '@mdi/js';

export default {
	name: 'Output',
	data () {
		return {
			mdiViewList,
			tab: 0,
		};
	},
	computed: {
		...mapGetters(CODE_MODULE, {
			codeOutput: CODE_OUTPUT,
		}),
		stdout () {
			return this.codeOutput && this.codeOutput.stdout;
		},
		stderr () {
			return this.codeOutput && this.codeOutput.stderr;
		},
	},
};
</script>

<style lang="scss">
#Output {
	&.v-card {
		.v-card__text {
			box-shadow: 0 4px 1px rgba(0, 0, 0, 0.25) inset;
		}
	}
}
</style>
