<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-top-center"
		bottom
		:open-delay="300"
		:nudge-bottom="6"
	>
		<template #activator="{ on, attrs }">
			<v-icon
				class="ma-0 pa-0"
				:color="value ? 'success' : 'error'"
				v-bind="attrs"
				v-on="on"
			>
				{{
					value
						? mdiCheckCircleOutline
						: mdiCloseCircleOutline
				}}
			</v-icon>
			<span class="ml-2 body-2">
				{{ $t(`common.${ value ? 'active' : 'deactive' }`) }}
			</span>
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
