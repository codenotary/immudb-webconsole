<template>
	<v-dialog
		content-class="primary-outlined"
		:value="value"
		max-width="600px"
		persistent
		:overlay-opacity="0.55"
		@input="$emit('input', $event)"
	>
		<v-card class="ma-0 pa-0 bg">
			<v-card-title class="ma-0 mb-2 py-2 px-4 primary d-flex justify-start align-center">
				<v-icon
					class="bg--text"
					:size="20"
				>
					{{ mdiAccountPlusOutline }}
				</v-icon>
				<span class="ml-2 bg--text subtitle-1">
					{{ $t('users.action.add.title', { user }) }}
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
				<ValidationObserver
					ref="observer"
					v-slot="{ validate }"
				>
					<v-form
						v-if="form"
						id="AddUserForm"
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
								v-model="form.user"
								:error-messages="errors"
								class="text-field--fill"
								:label="$t('users.modal.add.username')"
								:placeholder="$t('users.modal.add.username')"
								autofocus
								required
								type="text"
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
								v-model="form.password"
								:error-messages="errors"
								class="text-field--fill"
								:label="$t('users.modal.add.password')"
								:placeholder="$t('users.modal.add.password')"
								required
								:type="show ? 'text' : 'password'"
								:append-icon="show ? mdiEye : mdiEyeOff"
								@click:append="show = !show"
							/>
						</ValidationProvider>
						<UiActionDatabaseSelect
							all
							@update="onUpdateDatabase"
						/>
						<UsersActionPermissionSelect
							@update="onUpdatePermission"
						/>
					</v-form>
				</ValidationObserver>
			</v-card-text>
			<v-card-actions class="ma-0 pa-4 d-flex justify-center">
				<v-btn
					class="px-4"
					outlined
					color="primary"
					@click="$emit('input', false)"
				>
					{{ $t('common.cancel') }}
				</v-btn>
				<v-btn
					class="ma-0 ml-2 py-0 px-4"
					color="primary"
					type="submit"
					form="AddUserForm"
				>
					{{ $t('common.confirm') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { required } from 'vee-validate/dist/rules';
import {
	extend,
	ValidationObserver,
	ValidationProvider,
	setInteractionMode,
} from 'vee-validate';
import {
	mdiAccountPlusOutline,
	mdiClose,
	mdiEye,
	mdiEyeOff,
} from '@mdi/js';

extend('required', {
	...required,
	message: 'This field is required',
});

extend('strong_password', {
	validate: _ => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(_),
	message: field => 'The ' + field + ' must contain at least 1 uppercase letter, 1 digit and 1 special character.',
});

setInteractionMode('eager');

export default {
	name: 'UsersModalAdd',
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
			mdiAccountPlusOutline,
			mdiClose,
			mdiEye,
			mdiEyeOff,
			show: false,
			form: {
				user: '',
				password: '',
				permission: '1',
				database: '',
			},
		};
	},
	watch: {
		value (newVal) {
			this.form = {
				user: '',
				password: '',
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
			const valid = await this.$refs.observer.validate();

			if (valid) {
				this.$emit('submit', {
					user: btoa(this.form.user),
					password: btoa(this.form.password),
					permission: this.form.permission,
					database: this.form.database,
				});
				this.$emit('input', false);
			}
		},
	},
};
</script>
