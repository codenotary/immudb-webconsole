<template>
	<v-card
		id="Code"
		class="ma-0 pt-0 pb-1 px-1 bg fill-height shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-start align-center">
			<CodeRun
				@submit="onSubmit"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-secondary custom-scrollbar"
		>
			<div class="ma-0 pa-0">
				<CodeBlock
					v-if="!loading"
					class="ma-0 pa-0"
					:code="example && example.code"
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
import Vue from 'vue';
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
	},
	watch: {
		codePath: {
			immediate: true,
			async handler (newVal) {
				if (newVal) {
					console.log(newVal);
					this.loading = true;
					let _path = newVal.startsWith('/') ? newVal : `/${ newVal }`;
					_path = _path.endsWith('.json') ? _path : `${ _path }.json`;
					console.log(_path);
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
				}
			},
		},
	},
	methods: {
		...mapActions(CODE_MODULE, {
			runCode: RUN_CODE,
		}),
		onUpdate (data) {
			if (data) {
				Vue.set(this.example, 'code', data);
			}
		},
		onSubmit () {
			const { code } = this.example;
			code && this.runCode({
				code,
				immudb: this.immudb || '',
			});
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
