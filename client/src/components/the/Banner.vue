<template>
	<v-system-bar
		v-if="open"
		id="TheBanner"
		class="primary darken-1 d-flex justify-center align-center"
		fixed
		app
	>
		<v-spacer />
		<a
			class="d-flex justify-center align-center"
			:href="'https://github.com/codenotary/immudb'"
			target="_blank"
			rel="noopener"
			:alt="$t('banner.title')"
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
		</a>
		<v-spacer />
		<v-btn
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
	mdiStar,
	mdiClose,
} from '@mdi/js';

export default {
	name: 'TheBanner',
	data () {
		return {
			mdiStar,
			mdiClose,
			height: 1,
			open: true,
		};
	},
	methods: {
		onClose () {
			this.$emit('close');
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
