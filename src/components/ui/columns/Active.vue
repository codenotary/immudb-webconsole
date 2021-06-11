<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined"
		bottom
		:open-delay="300"
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
						? mdiCheck
						: mdiClose
				}}
			</v-icon>
		</template>
		<span class="body-2">
			{{ $t(`users.${ value ? 'active' : 'notActive' }`) }}
		</span>
	</v-tooltip>
</template>

<script>
import {
	mdiCheck,
	mdiClose,
} from '@mdi/js';

export default {
	name: 'UiColumnsActive',
	props: {
		value: { type: [String, Boolean], default: '' },
	},
	data () {
		return {
			mdiCheck,
			mdiClose,
		};
	},
};
</script>
