<template>
	<v-tooltip
		bottom
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				depressed
				small
				icon
				:alt="$t('common.clear')"
				v-bind="attrs"
				v-on="on"
				@click="onSubmit"
			>
				<v-icon
					class="title"
				>
					{{ mdiBroom }}
				</v-icon>
			</v-btn>
		</template>
		<span>
			{{ $t('common.clear') }}
		</span>
	</v-tooltip>
</template>

<script>
import {
	mdiBroom,
} from '@mdi/js';

export default {
	name: 'LiveActionClear',
	data () {
		return {
			mdiBroom,
		};
	},
	methods: {
		onSubmit () {
			this.$emit('submit');
		},
	},
};
</script>
