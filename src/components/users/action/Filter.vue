<template>
	<v-text-field
		ref="expandingSearch"
		:value="filter"
		class="expanding-search ma-0 pa-0"
		:class="{ 'closed': isClosed }"
		:label="$t('users.search.label')"
		:placeholder="$t('users.search.placeholder')"
		single-line
		hide-details
		dense
		:clearable="!isClosed"
		@input="onUpdate"
		@click:clear="onClose"
		@focus="onOpen"
		@blur="onClose"
	>
		<template #prepend>
			<v-tooltip
				content-class="ma-0 py-2 px-4 bg primary-outlined arrow-top-center"
				:disabled="active"
				bottom
				:open-delay="300"
				:nudge-bottom="6"
			>
				<template #activator="{ on, attrs }">
					<v-icon
						color="primary"
						:size="24"
						v-bind="attrs"
						v-on="on"
						@click="onOpen"
					>
						{{ mdiFilterOutline }}
					</v-icon>
				</template>
				<span class="body-2">
					{{ $t('users.search.tooltip') }}
				</span>
			</v-tooltip>
		</template>
	</v-text-field>
</template>

<script>
import {
	mdiFilterOutline,
	mdiClose,
} from '@mdi/js';

export default {
	name: 'UsersActionFilter',
	props: {
		filter: { type: String, default: '' },
	},
	data () {
		return {
			mdiFilterOutline,
			mdiClose,
			active: false,
		};
	},
	computed: {
		isClosed () {
			return !this.active && !this.filter;
		},
	},
	methods: {
		onOpen () {
			this.active = true;
			this.$nextTick(() => {
				const { expandingSearch } = this.$refs;
				expandingSearch && expandingSearch.focus();
			});
		},
		onClose () {
			this.active = false;
			this.$emit('update:input', '');
			this.$nextTick(() => {
				const { expandingSearch } = this.$refs;
				expandingSearch && expandingSearch.blur();
			});
		},
		onUpdate (data) {
			this.$emit('update:filter', data);
		},
	},
};
</script>

<style lang="scss">
.v-input.expanding-search {
	transition: max-width 0.3s;
	max-width: 320px;

	.v-input__slot {
		cursor: pointer;

		&::before,
		&::after {
			border-color: transparent !important;
		}
	}

	&.closed {
		max-width: $spacer-8 !important;

		.v-input__slot {
			background-color: transparent !important;
		}
	}
}
</style>
