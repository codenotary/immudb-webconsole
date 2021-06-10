<template>
	<span>
		<v-tooltip
			content-class="ma-0 py-2 px-4 bg primary-outlined"
			top
			:open-delay="100"
		>
			<template #activator="{ on, attrs }">
				<v-btn
					:loading="isLoading"
					color="secondary"
					icon
					:disabled="disabled"
					v-bind="attrs"
					v-on="on"
					@click="showUseDatabaseModal = true"
				>
					<v-icon
						:class="{
							'black--text ': !$vuetify.theme.dark,
							'white--text': $vuetify.theme.dark,
						}"
						:size="20"
					>
						{{ mdiDatabaseCheckOutline }}
					</v-icon>
				</v-btn>
			</template>
			<span class="body-2">
				{{ $t('databases.table.action.use.tooltip', { value: `${ databaseName }`, databaseName }) }}
			</span>
		</v-tooltip>

		<!-- MODALS -->
		<UiModalConfirm
			v-model="showUseDatabaseModal"
			color="success"
			:title="$t('databases.table.modal.use.title', { databaseName })"
			:confirm-text="$t('common.confirm')"
			:cancel-text="$t('common.cancel')"
			@confirm="onUseDatabase"
		>
			<template #icon>
				<v-icon
					:class="{
						'black--text ': !$vuetify.theme.dark,
						'white--text': $vuetify.theme.dark,
					}"
				>
					{{ mdiDatabaseCheckOutline }}
				</v-icon>
			</template>
			<p v-html="$t('databases.table.modal.use.sure')" />
		</UiModalConfirm>
	</span>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	IS_LOADING,
} from '@/store/view/constants';
import {
	mdiDatabaseCheckOutline,
} from '@mdi/js';

export default {
	name: 'DatabasesDatatableActions',
	props: {
		item: { type: Object, default: () => {} },
		disabled: { type: Boolean, default: false },
	},
	data() {
		return {
			mdiDatabaseCheckOutline,
			showUseDatabaseModal: false,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			isLoading: IS_LOADING,
		}),
		databaseName () {
			if (this.item) {
				const { databaseName } = this.item;
				return databaseName;
			}
			return '';
		},
	},
	methods: {
		onUseDatabase () {
			this.$emit('update:use', this.databaseName);
		},
	},
};
</script>
