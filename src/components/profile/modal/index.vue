<template>
	<v-dialog
		class="ma-0 pa-0 bg d-flex justify-start align-center"
		max-width="600px"
		:color="'warning'"
		:value="value"
		persistent
		:overlay-opacity="0.95"
	>
		<v-card class="ma-0 pa-4">
			<v-card-title class="ma-0 mb-2 pa-0">
				<v-icon
					:class="{
						'gray--text text--darken-1': !$vuetify.theme.dark,
						'gray--text text--lighten-1': $vuetify.theme.dark,
					}"
				>
					{{ mdiAccountSettingsOutline }}
				</v-icon>
				<span class="ml-2">
					{{ $t('profile.preferences.title') }}
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
						id="LoginForm"
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
								:label="$t('login.label.username')"
								:placeholder="$t('login.placeholder.username')"
								autofocus
								required
								type="text"
							/>
						</ValidationProvider>
					</v-form>
				</ValidationObserver>
			</v-card-text>
			<v-card-actions class="ma-0 pa-0 d-flex justify-end">
				<v-btn
					text
					@click="onClose"
				>
					{{ $t('common.cancel') }}
				</v-btn>
				<v-btn
					class="primary-gradient"
					color="primary"
					form="LoginForm"
					type="submit"
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
} from 'vee-validate/dist/rules';
import {
	extend,
	ValidationObserver,
	ValidationProvider,
	setInteractionMode,
} from 'vee-validate';
import {
	mdiAccountSettingsOutline,
} from '@mdi/js';

extend('required', {
	...required,
	message: 'This field is required',
});

setInteractionMode('eager');

export default {
	name: 'ProfileModal',
	components: {
		ValidationObserver,
		ValidationProvider,
	},
	props: {
		value: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiAccountSettingsOutline,
			show: false,
			form: {
				user: '',
				password: '',
			},
		};
	},
	watch: {
		value (newVal) {
			this.form = {
				user: '',
				password: '',
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
		onSubmit () {
			// this.$emit('submit', {
			// 	user: this.form.user,
			// 	password: this.form.password,
			// });
			this.$emit('input', false);
		},
	},
};
</script>
