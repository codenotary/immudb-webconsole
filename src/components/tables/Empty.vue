<template>
	<div class="ma-0 py-4 px-2 d-flex flex-column justify-start align-center">
		<p class="ma-0 mb-4 pa-0 text-center">
			{{ $t('tables.empty.label') }}
		</p>
		<v-btn
			class="ma-0 py-0 px-2 d-flex justify-center align-center"
			text
			dense
			@click="onSubmit"
		>
			<v-icon
				class="ma-0 pa-0"
				size="20"
			>
				{{ mdiPlusCircleOutline }}
			</v-icon>
			<span class="ma-0 ml-1 pa-0 caption">
				{{ $t('tables.empty.button') }}
			</span>
		</v-btn>
	</div>
</template>

<script>
import {
	mdiPlusCircleOutline,
} from '@mdi/js';

export default {
	name: 'TablesEmpty',
	data () {
		return {
			mdiPlusCircleOutline,
		};
	},
	methods: {
		onSubmit () {
			this.$emit('submit');
		},
	},
};
</script>
