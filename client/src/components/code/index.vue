<template>
	<v-card
		id="Code"
		class="ma-0 pt-0 pb-1 px-1 bg fill-height shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-start align-center">
			<CodeReset
				@reset="onReset"
			/>
			<v-divider
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<CodeRun
				@submit="onSubmit"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-secondary custom-scrollbar"
		>
			<div class="ma-0 pt-4 pl-6 pr-4 pb-2">
				<h4
					v-if="title"
					class="ma-0 mb-2 pa-0 title"
				>
					{{ title }}
				</h4>
				<v-skeleton-loader
					v-else
					class="ma-0 mb-4 ml-n2 pa-0"
					width="40%"
					:height="24"
					type="image"
				/>
				<p
					v-if="description"
					class="ma-0 mb-2 pa-0 body-2"
				>
					{{ description }}
				</p>
				<v-skeleton-loader
					v-else
					class="ma-0 mb-4 ml-n2 pa-0"
					width="80%"
					:height="16"
					type="image"
				/>
				<v-divider
					class="ma-0 mt-4 pa-0"
					style="width: 80%;"
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
			const { title } = this.activeExample;
			return title || '';
		},
		description () {
			const { description } = this.activeExample;
			return description || '';
		},
		activeCode () {
			const { code } = this.activeExample;
			return code || '';
		},
	},
	watch: {
		activeCode: {
			immediate: true,
			handler (newVal) {
				this.id = uniqueId('id_');
				this.code = newVal;
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
