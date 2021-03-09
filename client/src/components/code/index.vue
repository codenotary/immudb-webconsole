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
					v-if="!loading && code"
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
	CODE_MODULE,
	RUN_CODE,
	IMMUDB,
} from '@/store/code/constants';
import {
	EXAMPLE_MODULE,
	SET_ACTIVE_EXAMPLE,
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
		...mapGetters(CODE_MODULE, {
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
		...mapActions(CODE_MODULE, {
			runCode: RUN_CODE,
		}),
		...mapActions(EXAMPLE_MODULE, {
			setActiveExample: SET_ACTIVE_EXAMPLE,
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
		onSubmit () {
			try {
				this.runCode({
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
