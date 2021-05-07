<template>
	<v-dialog
		class="user-type-modal"
		:value="value"
		max-width="600px"
		@input="$emit('input', $event)"
	>
		<v-card class="ma-0 pa-4">
			<v-card-title class="ma-0 mb-2 pa-0">
				<span>
					{{ $t('users.table.modal.updatePermissions.title', { user }) }}
				</span>
			</v-card-title>
			<v-card-text
				class="ma-0 mb-2 pa-0"
				style="overflow-x: hidden !important;"
			>
				<UsersActionPermissionSelect
					@update="onUpdatePermission"
				/>
				<UsersActionDatabaseSelect
					@update="onUpdateDatabase"
				/>
			</v-card-text>
			<v-card-actions class="ma-0 pa-0 d-flex justify-end">
				<v-btn
					text
					@click="$emit('input', false)"
				>
					{{ $t('common.cancel') }}
				</v-btn>
				<v-btn
					class="ml-2 success-gradient"
					color="success"
					type="submit"
					form="UpdatePasswordForm"
				>
					{{ $t('common.confirm') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>

export default {
	name: 'UsersModalUpdatePassword',
	props: {
		user: { type: String, default: '' },
		value: { type: Boolean, default: false },
	},
	data () {
		return {
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
	},
	methods: {
		async onSubmit() {
			const valid = await this.$refs.observer.validate();
			if (valid) {
				this.$emit('submit', {
					action: 'GRANT',
					user: btoa(this.user),
					permission: this.form.permission,
					database: this.form.database,
				});
				this.$emit('input', false);
			}
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
