<template>
	<v-card
		id="Code"
		class="ma-0 pa-0 bg fill-height pane shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-end align-center">
			<v-icon
				class="ml-2 title"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiXml }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 title"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('code.title') }}
			</h4>
			<v-spacer />
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
			class="ma-0 pa-0 bg-terminal custom-scrollbar"
		>
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
	VIEW_MODULE,
	IS_LOADING,
} from '@/store/view/constants';
import {
	OUTPUT_MODULE,
	RESET_IMMUDB,
	RESET_MERKLE_TREE,
	RESET_OUTPUT,
} from '@/store/output/constants';
import {
	CODE_MODULE,
	ACTIVE_CODE,
	ACTIVE_LANGUAGE,
} from '@/store/code/constants';
import {
	WEBSOCKET_MODULE,
	SOCKET_OBJ_MESSAGE,
} from '@/store/websocket/constants';
import {
	mdiXml,
} from '@mdi/js';

const ITEMS_TYPES = {
	TEXT: 'text',
	IMPORT: 'import',
	CODE: 'code',
};
const uniqueId = require('lodash.uniqueid');

export default {
	name: 'Code',
	data () {
		return {
			ITEMS_TYPES,
			mdiXml,
			id: 0,
			code: '',
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			loading: IS_LOADING,
		}),
		...mapGetters(CODE_MODULE, {
			activeCode: ACTIVE_CODE,
			activeLanguage: ACTIVE_LANGUAGE,
		}),
	},
	watch: {
		activeCode: {
			immediate: true,
			deep: true,
			handler (newVal) {
				if (newVal && newVal !== this.code) {
					this.code = newVal;
					this.id = uniqueId('id_');
				}
			},
		},
	},
	mounted() {
		this._keyListener = function(e) {
			if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				if (!this.isLoading && this.code) {
					this.onSubmit();
				}
			}
			if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				if (!this.isLoading) {
					this.onReset();
				}
			}
		};

		document.addEventListener('keydown', this._keyListener.bind(this));
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this._keyListener);
	},
	methods: {
		...mapActions(WEBSOCKET_MODULE, {
			sendObj: SOCKET_OBJ_MESSAGE,
		}),
		...mapActions(OUTPUT_MODULE, {
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
				await this.sendObj({
					code: this.code || '',
					language: this.activeLanguage.label || '',
				});
			}
			catch (err) {
				//
			}
		},
	},
};
</script>
