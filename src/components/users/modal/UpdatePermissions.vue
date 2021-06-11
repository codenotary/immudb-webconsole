<template>
	<v-dialog
		class="user-type-modal"
		:value="value"
		max-width="600px"
		:overlay-opacity="0.95"
		@input="$emit('input', $event)"
	>
		<v-card class="ma-0 pa-0 bg">
			<v-card-title class="ma-0 mb-2 py-2 px-4 primary d-flex justify-start align-center">
				<v-icon
					class="bg--text"
					:size="20"
				>
					{{ mdiAccountCheckOutline }}
				</v-icon>
				<span
					v-if="add"
					class="ml-2 bg--text"
				>
					{{ $t('users.table.permissions.add.title', { user }) }}
				</span>
				<span
					v-else
					class="pl-2 bg--text"
				>
					{{ $t('users.table.permissions.edit.title', { user }) }}
				</span>
				<v-spacer />
				<v-btn
					icon
					small
					@click="onClose"
				>
					<v-icon
						class="bg--text"
						:size="20"
					>
						{{ mdiClose }}
					</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text
				class="ma-0 mb-2 pa-4 pt-2"
				style="overflow-x: hidden !important;"
			>
				<UiActionDatabaseSelect
					all
					:disabled="edit"
					:initial-value="database"
					@update="onUpdateDatabase"
				/>
				<UsersActionPermissionSelect
					:initial-value="permission"
					@update="onUpdatePermission"
				/>
			</v-card-text>
			<v-card-actions class="ma-0 pa-4 d-flex justify-end">
				<v-btn
					text
					@click="$emit('input', false)"
				>
					{{ $t('common.cancel') }}
				</v-btn>
				<v-btn
					class="ml-2"
					color="primary"
					@click="onSubmit"
				>
					<span v-if="add">
						{{ $t('users.table.permissions.add.button') }}
					</span>
					<span v-else>
						{{ $t('common.confirm') }}
					</span>
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import {
	mdiAccountCheckOutline,
	mdiClose,
} from '@mdi/js';

export default {
	name: 'UsersModalUpdatePermission',
	props: {
		add: { type: Boolean, default: false },
		edit: { type: Boolean, default: false },
		user: { type: String, default: '' },
		database: { type: String, default: '' },
		permission: { type: [String, Number], default: '' },
		parsed: { type: String, default: '' },
		value: { type: Boolean, default: false },
		action: { type: String, default: 'GRANT' },
	},
	data () {
		return {
			mdiAccountCheckOutline,
			mdiClose,
			form: {
				permission: '1',
				database: '',
			},
		};
	},
	watch: {
		value (newVal) {
			this.form = {
				permission: '1',
				database: '',
			};
			this.$nextTick(() => {
				const { observer } = this.$refs;
				observer && observer.reset();
			});
		},
		database (newVal) {
			this.form.database = newVal;
		},
		permission (newVal) {
			this.form.permission = newVal;
		},
	},
	methods: {
		onClose () {
			this.$emit('input', false);
		},
		onUpdatePermission (data) {
			this.form.permission = data;
		},
		onUpdateDatabase (data) {
			this.form.database = data;
		},
		async onSubmit() {
			await this.$emit('submit', {
				action: 'GRANT',
				username: this.user,
				permission: this.form.permission,
				database: this.form.database,
			});
			this.$emit('input', false);
		},
	},
};
</script>

<style lang="scss">
.user-type-modal {
	.body {
		display: flex;
		align-items: center;
		flex: 1;
		padding-top: $spacer * 1.5 !important;
		padding-bottom: $spacer * 1.5 !important;

		.icon {
			flex: 0;
			font-size: 32px;
			color: $error;
		}

		.content {
			padding-top: 0 !important;
			width: 100%;
		}
	}

	.footer {
		display: flex;
		justify-content: flex-end;
	}
}
</style>
