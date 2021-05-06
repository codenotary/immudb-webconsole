<template>
	<v-card
		id="Users"
		class="ma-0 pa-0 bg fill-height pane shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-end align-center">
			<v-icon
				class="ml-2"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiAccountMultipleOutline }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 pt-1 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('users.title') }}
			</h4>
			<v-spacer />
			<UsersActionAdd
				@submit="onAddUser"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-secondary custom-scrollbar"
		>
			<div class="ma-0 pa-0 fill-height">
				<UsersDatatable
					class="ma-0 pa-0 fill-height"
				/>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import {
	mdiAccountMultipleOutline,
} from '@mdi/js';

export default {
	name: 'Users',
	data () {
		return {
			mdiAccountMultipleOutline,
		};
	},
	methods: {
		onAddUser () {
			console.log('add user');
		},
	},
};
</script>
