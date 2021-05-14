<template>
	<v-system-bar
		v-if="value"
		id="TheBanner"
		class="primary darken-1 d-flex justify-center align-center"
		:color="color"
		fixed
		app
	>
		<slot>
			<v-icon
				class="ma-0 pa-0"
				:size="18"
			>
				{{ mdiAlert }}
			</v-icon>
			<span
				class="ma-0 ml-2 pa-0 caption white--text text-center font-weight-bold"
				style="margin-top: 1px !important;"
			>
				{{ title }}
			</span>
			<!--<v-spacer />
			<a
				class="d-flex justify-center align-center"
				:href="'https://github.com/codenotary/immudb'"
				target="_blank"
				rel="noopener"
				:alt="$t('banner.title')"
				@click="onSubmit"
			>
				<v-icon
					class="ma-0 pa-0"
					color="warning"
					:size="18"
				>
					{{ mdiStar }}
				</v-icon>
				<span
					class="ma-0 ml-2 pa-0 caption white--text font-weight-bold"
					style="margin-top: 1px !important;"
				>
					{{ $t('banner.title') }}
				</span>
			</a> -->
		</slot>
		<v-spacer
			v-if="!persistent"
		/>
		<v-btn
			v-if="!persistent"
			class="ma-0 pa-0 text-center"
			text
			icon
			dense
			x-small
			@click="onClose"
		>
			<v-icon
				class="ma-0 pa-0"
				:size="18"
			>
				{{ mdiClose }}
			</v-icon>
		</v-btn>
	</v-system-bar>
</template>

<script>
import {
	mdiAlert,
	mdiStar,
	mdiClose,
} from '@mdi/js';

export default {
	name: 'TheBanner',
	props: {
		value: { type: Boolean, default: false },
		title: { type: String, default: '' },
		subtitle: { type: String, default: '' },
		color: { type: String, default: 'primary' },
		persistent: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiAlert,
			mdiStar,
			mdiClose,
			height: 1,
		};
	},
	methods: {
		onClose () {
			this.$emit('input');
		},
		onSubmit () {
			this.$emit('submit');
		},
	},
};
</script>

<style lang="scss">
#TheBanner {
	a {
		&:hover {
			span {
				text-decoration: underline !important;
			}
		}
	}
}
</style>
