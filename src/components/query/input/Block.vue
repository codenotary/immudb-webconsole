<template>
	<v-container
		id="QueryBlock"
		class="query-block fill-height"
		@click="onFocus"
	>
		<v-row
			class="ma-0 pa-0 justify-stretch align-start fill-width"
		>
			<v-col
				class="query-wrapper ma-0 pa-0"
				:class="`query-wrapper ma-0 pa-0 theme--${ $vuetify.theme.dark
					? 'dark'
					: 'light'
				}`"
				cols="12"
			>
				<span
					v-if="queryIsEmpty"
					class="query-placeholder white--text body-2"
					@click="onFocus"
				>
					{{ PLACEHOLDER }}
				</span>
				<prism-editor
					ref="prism"
					v-model="editableQuery"
					class="query command ma-0 mb-2 py-0 px-2 fill-width"
					language="sql"
					line-numbers
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { caretMixin } from '@/mixins/caretMixin';

const PLACEHOLDER = 'Eg: SELECT * FROM <tablename>';

export default {
	name: 'QueryInputBlock',
	mixins: [caretMixin],
	props: {
		query: { type: String, default: '' },
		full: { type: Boolean, deafault: false },
	},
	data () {
		return {
			PLACEHOLDER,
			editableQuery: '',
			plugins: [
				'command-line',
				'match-braces',
				'line-highlight',
				'line-numbers',
				'show-language',
			],
		};
	},
	computed: {
		queryIsEmpty () {
			return !this.query.trim();
		},
	},
	watch: {
		query: {
			deep: true,
			immediate: true,
			handler (newVal) {
				this.editableQuery = newVal;
			},
		},
		editableQuery: {
			deep: true,
			immediate: false,
			handler (newVal, oldVal) {
				if (newVal !== oldVal) {
					this.$emit('update:query', newVal);
				}
			},
		},
	},
	mounted () {
		this.onFocus();

		this.$eventbus && this.$eventbus
				// detecting updates on query.
				.$on('EVENT_BUS==>updateQuery', (data) => {
					this.onQueryUpdate(data);
				})
				.$on('EVENT_BUS==>focusQuery', () => {
					this.onFocus();
				});
	},
	beforeDestroy() {
		this.$eventbus && this.$eventbus
				.$off('EVENT_BUS==>updateQuery')
				.$off('EVENT_BUS==>focusQuery');
	},
	methods: {
		onQueryUpdate ({ value }) {
			const { prism } = this.$refs;
			const { start, end } = this.getCaretPosition(prism);
			let _query = this.query;
			if (start === undefined && end === undefined) {
				_query = `${ _query }${ value }`;
			}
			else if (start === end) {
				_query = `${ _query.slice(0, start) }${ value }${ _query.slice(start) }`;
			}
			else if (start !== undefined && end !== undefined) {
				_query = `${ _query.slice(0, start) }${ value }${ _query.slice(end) }`;
			}
			this.$emit('update:query', _query);
		},
		onFocus () {
			try {
				const { prism, prism: { $el: { children } } } = this.$refs;
				const queryLength = this.query ? this.query.length : 0;
				children[1].focus();
				this.$nextTick(() => this.moveCaret(prism, queryLength));
			}
			catch (err) {
				console.error(err);
			}
		},
	},
};
</script>

<style lang="scss">
$prism-font-size: 16;

.query-block {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	min-height: 100%;

	.query-wrapper {
		position: relative;

		.query-placeholder {
			position: absolute;
			top: #{$prism-font-size + 8}px;
			left: calc(#{$spacer-14} + 1px);
			font-size: #{$prism-font-size}px !important;
			line-height: #{$prism-font-size}px !important;
		}

		.prism-editor__line-numbers,
		.query {
			font-size: #{$prism-font-size}px !important;
			line-height: 1.5 !important;

			code.language-sql,
			span {
				font-size: #{$prism-font-size}px !important;
				line-height: #{$prism-font-size}px !important;
			}
		}

		&.theme-- {
			&light {
				.prism-editor__line-number {
					color: map-get($grey, lighten-2) !important;
				}
			}

			&dark {
				.prism-editor__line-number {
					color: map-get($grey, lighten-1) !important;
				}
			}
		}
	}

	.v-card__title {
		height: 64px;
		width: 100% !important;
	}

	.prism-editor-wrapper {
		overflow: hidden !important;
	}
}
</style>
