<template>
	<div class="ma-0 py-4 px-2 d-flex flex-column justify-start align-center">
		<p class="ma-0 mb-4 pa-0 text-center">
			{{ $t('query.tables.empty.label') }}
		</p>
		<v-btn
			v-if="allowed"
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
				{{ $t('query.tables.empty.button') }}
			</span>
		</v-btn>
		<span
			v-else
			class="ma-0 py-0 px-4 caption"
			v-html="$t('query.tables.add.notAllowed')"
		/>
	</div>
</template>

<script>
import {
	mdiPlusCircleOutline,
} from '@mdi/js';

export default {
	name: 'QueryTablesEmpty',
	props: {
		allowed: { type: Boolean, default: false },
	},
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
