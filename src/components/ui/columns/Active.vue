<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined"
		bottom
		:open-delay="300"
	>
		<template #activator="{ on, attrs }">
			<div
				class="d-flex justify-start align-center"
				v-bind="attrs"
				v-on="on"
			>
				<v-icon
					class="ma-0 pa-0"
					:color="value ? 'success' : 'error'"
					size="20"
				>
					{{
						value
							? mdiCheckCircleOutline
							: mdiCloseCircleOutline
					}}
				</v-icon>
				<span
					class="ml-1 body-2"
					:class="{
						'success--text': value,
						'error--text': !value,
					}"
					style="top: 3px;"
				>
					{{ $t(`common.${ value ? 'active' : 'deactive' }`) }}
				</span>
			</div>
		</template>
		<span class="body-2">
			{{ $t(`common.${ value ? 'active' : 'deactive' }`) }}
		</span>
	</v-tooltip>
</template>

<script>
import {
	mdiCheckCircleOutline,
	mdiCloseCircleOutline,
} from '@mdi/js';

export default {
	name: 'UsersDatatable',
	props: {
		value: { type: [String, Boolean], default: '' },
	},
	data () {
		return {
			mdiCheckCircleOutline,
			mdiCloseCircleOutline,
		};
	},
};
</script>
