<template>
	<v-card
		class="ma-0 pa-4 bg-transparent fill-width"
		elevation="0"
	>
		<v-card-title class="ma-0 mb-4 pa-0">
			<v-icon
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiLocationEnter }}
			</v-icon>
			<span class="ml-2">
				{{ $t('login.title') }}
			</span>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0"
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
					@submit.prevent="validate().then(onLogin)"
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
							class="mb-2 text-field--fill"
							:light="$vuetify.theme.dark"
							:dark="!$vuetify.theme.dark"
							:label="$t('login.label.username')"
							:placeholder="$t('login.placeholder.username')"
							autofocus
							required
							solo
							type="text"
							@click:append="show = !show"
						/>
					</ValidationProvider>
					<ValidationProvider
						v-slot="{ errors }"
						name="confirm"
						:rules="`required`"
						mode="aggressive"
						:debounce="300"
					>
						<v-text-field
							v-model="form.password"
							:error-messages="errors"
							class="mb-2 text-field--fill"
							:light="$vuetify.theme.dark"
							:dark="!$vuetify.theme.dark"
							:label="$t('login.label.password')"
							:placeholder="$t('login.placeholder.password')"
							required
							solo
							:type="show ? 'text' : 'password'"
							:append-icon="show ? mdiEye : mdiEyeOff"
							@click:append="show = !show"
						/>
					</ValidationProvider>
				</v-form>
			</ValidationObserver>
		</v-card-text>
		<v-card-actions class="ma-0 pa-0 d-flex justify-end">
			<v-btn
				class="primary-gradient"
				color="primary"
				form="LoginForm"
				type="submit"
				block
				large
			>
				{{ $t('login.submit') }}
			</v-btn>
		</v-card-actions>
	</v-card>
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
	mdiLocationEnter,
	mdiEye,
	mdiEyeOff,
} from '@mdi/js';

extend('required', {
	...required,
	message: 'This field is required',
});

setInteractionMode('eager');

export default {
	name: 'UiModalFreezePatch',
	components: {
		ValidationObserver,
		ValidationProvider,
	},
	props: {
		value: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiLocationEnter,
			mdiEye,
			mdiEyeOff,
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
		onLogin () {
			this.$emit('submit', {
				user: this.form.user,
				password: this.form.password,
			});
			this.$emit('input', false);
		},
	},
};
</script>