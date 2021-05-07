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
					{{ $t('users.table.modal.updatePassword.title', { user }) }}
				</span>
			</v-card-title>
			<v-card-text
				class="ma-0 mb-2 pa-0"
				style="overflow-x: hidden !important;"
			>
				<ValidationObserver
					ref="observer"
					v-slot="{ validate }"
				>
					<v-form
						v-if="form"
						id="UpdatePasswordForm"
						class="ma-0 pa-0"
						@submit.prevent="validate().then(onSubmit)"
					>
						<ValidationProvider
							v-slot="{ errors }"
							name="confirm"
							:rules="`required`"
							mode="aggressive"
							:debounce="300"
						>
							<v-text-field
								v-model="form.oldPassword"
								:error-messages="errors"
								class="text-field--fill"
								:label="$t('users.table.modal.updatePassword.oldPassword')"
								:placeholder="$t('users.table.modal.updatePassword.oldPassword')"
								required
								:type="show.oldPassword ? 'text' : 'password'"
								:append-icon="show.oldPassword ? mdiEye : mdiEyeOff"
								@click:append="show.oldPassword = !show.oldPassword"
							/>
						</ValidationProvider>
						<ValidationProvider
							v-slot="{ errors }"
							name="confirm"
							:rules="`required|strong_password`"
							mode="aggressive"
							:debounce="300"
						>
							<v-text-field
								v-model="form.newPassword"
								:error-messages="errors"
								class="text-field--fill"
								:label="$t('users.table.modal.updatePassword.newPassword')"
								:placeholder="$t('users.table.modal.updatePassword.newPassword')"
								required
								:type="show.newPassword ? 'text' : 'password'"
								:append-icon="show.newPassword ? mdiEye : mdiEyeOff"
								@click:append="show.newPassword = !show.newPassword"
							/>
						</ValidationProvider>
						<ValidationProvider
							v-slot="{ errors }"
							name="confirm"
							:rules="`required|is:${ form.newPassword }`"
							mode="aggressive"
							:debounce="300"
						>
							<v-text-field
								v-model="form.confirmPassword"
								:error-messages="errors"
								class="text-field--fill"
								:label="$t('users.table.modal.updatePassword.confirmPassword')"
								:placeholder="$t('users.table.modal.updatePassword.confirmPassword')"
								required
								:type="show.confirmPassword ? 'text' : 'password'"
								:append-icon="show.confirmPassword ? mdiEye : mdiEyeOff"
								@click:append="show.confirmPassword = !show.confirmPassword"
							/>
						</ValidationProvider>
					</v-form>
				</ValidationObserver>
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
import {
	required,
	is,
} from 'vee-validate/dist/rules';
import {
	extend,
	ValidationObserver,
	ValidationProvider,
	setInteractionMode,
} from 'vee-validate';
import {
	mdiEye,
	mdiEyeOff,
} from '@mdi/js';

extend('required', {
	...required,
	message: 'This field is required',
});

extend('is', {
	...is,
	message: 'This field must be equal to {other}',
});

extend('strong_password', {
	validate: _ => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(_),
	message: field => 'The ' + field + ' must contain at least 1 uppercase letter, 1 digit and 1 special character.',
});

setInteractionMode('eager');

export default {
	name: 'UsersModalUpdatePassword',
	components: {
		ValidationProvider,
		ValidationObserver,
	},
	props: {
		user: { type: String, default: '' },
		value: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiEye,
			mdiEyeOff,
			show: {
				oldPassword: false,
				newPassword: true,
				confirmPassword: true,
			},
			form: {
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
			},
		};
	},
	watch: {
		value (newVal) {
			this.form = {
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
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
					user: btoa(this.user),
					oldPassword: btoa(this.form.oldPassword),
					newPassword: btoa(this.form.newPassword),
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