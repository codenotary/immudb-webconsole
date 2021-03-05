<template>
	<v-card
		id="Code"
		class="ma-0 pt-0 pb-1 px-1 bg fill-height"
		elevation="0"
	>
		<v-card-title class="ma-0 py-2 px-0 d-flex justify-start align-center">
			<CodeRun
				@submit="onSubmit"
			/>
		</v-card-title>
		<v-card-text
			v-if="!loading"
			class="ma-0 pa-0 bg-secondary fill-height custom-scrollbar"
		>
			<div class="ma-0 pa-0">
				<CodeBlock
					v-if="!loading"
					class="ma-0 pa-0"
					:code="code"
					:full="full"
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
	CODE_MODULE,
	RUN_CODE,
	IMMUDB,
} from '@/store/code/constants';

const ITEMS_TYPES = {
	TEXT: 'text',
	IMPORT: 'import',
	CODE: 'code',
};

export default {
	name: 'Code',
	props: {
		codePath: { type: String, default: '/python/hello_world' },
		full: { type: Boolean, deafault: '' },
	},
	data () {
		return {
			example: null,
			ITEMS_TYPES,
			loading: true,
		};
	},
	computed: {
		...mapGetters(CODE_MODULE, {
			immudb: IMMUDB,
		}),
		code () {
			if (this.example) {
				return this.example.code;
			}
			return 'Example is empty.';
		},
	},
	watch: {
		codePath: {
			immediate: true,
			async handler (newVal) {
				this.loading = true;
				let _path = newVal.startsWith('/') ? newVal : `/${ newVal }`;
				_path = _path.endsWith('.json') ? _path : `${ _path }.json`;
				await this.$axios.get(`/data/json${ _path }`)
						.then(async (response) => {
							this.example = response && response.data;
							const { url } = this.example;
							if (url) {
								let _url = url.startsWith('/') ? url : `/${ url }`;
								_url = _url.endsWith('.py') ? _url : `${ _url }.py`;
								await this.$axios.get(`/data/examples${ _url }`)
										.then((response2) => {
											this.example.code = response2 && response2.data;
											this.loading = false;
										}, (err) => {
											console.error(err);
											this.example = response.data;
											this.loading = false;
										});
							}
							else {
								this.loading = false;
							}
						}, (err) => {
							console.error(err);
							this.loading = false;
						});
			},
		},
	},
	methods: {
		...mapActions(CODE_MODULE, {
			runCode: RUN_CODE,
		}),
		onSubmit () {
			this.code && this.runCode({
				code: this.code,
				immudb: this.immudb || '',
			});
		},
	},
};
</script>

<style lang="scss">
#Code {
	&.v-card {
		.v-card__text {
			position: relative;

			&::before {
				content: '';
				display: block;
				position: sticky;
				top: 0;
				left: 0;
				right: 0;
				height: 4px;
				box-shadow: 0 4px 1px rgba(0, 0, 0, 0.25) inset;
			}
		}
	}
}
</style>
