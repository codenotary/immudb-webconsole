<template>
	<v-card
		id="Code"
		class="ma-0 pa-0 bg fill-height shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-start align-center">
			<CodeActionReset
				@reset="onReset"
			/>
			<v-divider
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<CodeActionRun
				:code="code"
				@submit="onSubmit"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-secondary custom-scrollbar"
		>
			<div class="ma-0 pt-4 pl-6 pr-4 pb-2">
				<CodeDetail
					:title="title"
					:description="description"
					:documentation-url="documentationUrl"
				/>
			</div>
			<div class="ma-0 pa-0">
				<CodeBlock
					v-if="code"
					:key="id"
					class="ma-0 pa-0"
					:code="code"
					@update="onUpdate"
				/>
				<CodeSkeleton
					v-else
					class="ma-0 pa-4"
				/>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	OUTPUT_MODULE,
	RUN_CODE,
	RESET_IMMUDB,
	RESET_MERKLE_TREE,
	RESET_OUTPUT,
	IMMUDB,
} from '@/store/output/constants';
import {
	EXAMPLE_MODULE,
	ACTIVE_EXAMPLE,
} from '@/store/example/constants';
import {
	VIEW_MODULE,
	IS_LOADING,
} from '@/store/view/constants';

const ITEMS_TYPES = {
	TEXT: 'text',
	IMPORT: 'import',
	CODE: 'code',
};
const uniqueId = require('lodash.uniqueid');

export default {
	name: 'Code',
	props: {
		codePath: { type: String, default: '/python/hello_world' },
	},
	data () {
		return {
			ITEMS_TYPES,
			id: 0,
			code: '',
		};
	},
	computed: {
		...mapGetters(EXAMPLE_MODULE, {
			activeExample: ACTIVE_EXAMPLE,
		}),
		...mapGetters(OUTPUT_MODULE, {
			immudb: IMMUDB,
		}),
		...mapGetters(VIEW_MODULE, {
			loading: IS_LOADING,
		}),
		title () {
			if (this.activeExample) {
				const { title } = this.activeExample;
				return title || '';
			}
			return '';
		},
		description () {
			if (this.activeExample) {
				const { description } = this.activeExample;
				return description || '';
			}
			return '';
		},
		documentationUrl () {
			if (this.activeExample) {
				const { documentation } = this.activeExample;
				return documentation || '';
			}
			return '';
		},
	},
	watch: {
		activeExample: {
			immediate: false,
			deep: true,
			handler (newVal) {
				if (newVal) {
					const { code } = newVal;
					this.id = uniqueId('id_');
					this.code = code;
				}
			},
		},
	},
	methods: {
		...mapActions(OUTPUT_MODULE, {
			runCode: RUN_CODE,
			resetImmudb: RESET_IMMUDB,
			resetMerkleTree: RESET_MERKLE_TREE,
			resetOutput: RESET_OUTPUT,
		}),
		onUpdate (data) {
			try {
				if (data) {
					this.code = data;
				}
			}
			catch (err) {
				console.error(err);
			}
		},
		onReset () {
			this.resetImmudb();
			this.resetMerkleTree();
			this.resetOutput();
		},
		async onSubmit () {
			try {
				await this.runCode({
					code: this.code || '',
					immudb: this.immudb || '',
				});
			}
			catch (err) {
				console.error(err);
			}
		},
	},
};
</script>

<style lang="scss">
#Code {
	&.v-card {
		.v-card__title {
			height: 44px !important;

			@media (max-width: 480px) {
				height: 32px !important;
			}
		}

		.v-card__text {
			height: calc(100% - 44px) !important;
		}
	}
}
</style>
