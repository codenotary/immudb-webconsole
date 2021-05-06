<template>
	<span>
		<v-menu
			v-if="visible"
			left
			:nudge-bottom="48"
		>
			<template #activator="{ on, attrs }">
				<v-btn
					icon
					v-bind="attrs"
					v-on="on"
				>
					<v-icon
						:class="{
							'gray--text text--darken-1': !$vuetify.theme.dark,
							'gray--text text--lighten-1': $vuetify.theme.dark,
						}"
					>
						{{ mdiCog }}
					</v-icon>
				</v-btn>
			</template>
			<v-list class="user-datatable-actions">
				<v-list-item
					@click="showDeleteUserModal = true"
				>
					<v-list-item-title class="d-flex justify-start align-center">
						<v-icon
							:class="{
								'gray--text text--darken-1': !$vuetify.theme.dark,
								'gray--text text--lighten-1': $vuetify.theme.dark,
							}"
						>
							{{ mdiCircle }}
						</v-icon>
						<span class="body-2">
							BANANA
						</span>
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>

		<!-- MODALS -->
		<UiModalConfirm
			v-model="showDeleteUserModal"
			color="warning"
			:title="$t('ledgers.confirmEnableModal.title')"
			:confirm-text="$t('ledgers.confirmEnableModal.confirmText')"
			:cancel-text="$t('ledgers.confirmEnableModal.cancelText')"
			@confirm="onDeleteUser"
		>
			<p>
				{{ $t('ledgers.confirmEnableModal.text') }}
			</p>
		</UiModalConfirm>
	</span>
</template>

<script>
import {
	mdiCog,
	mdiCircle,
} from '@mdi/js';

export default {
	name: 'UsersDatatableActions',
	props: {
		id: { type: String, default: '' },
		name: { type: String, default: '' },
	},
	data() {
		return {
			mdiCog,
			mdiCircle,
			showDeleteUserModal: false,
		};
	},
	methods: {
		onDeleteUser(data) {
			console.log(data);
		},
	},
};
</script>
