<template>
	<v-card
		id="Databases"
		class="ma-0 pa-0 pr-4 bg fill-height pane shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 pl-1 pr-0 d-flex justify-start align-center">
			<v-icon
				class="ml-2"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiDatabaseCogOutline }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 pt-1 subtitle-1 font-weight-bold"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('databases.title') }}
			</h4>
			<v-spacer />
			<DatabasesActionFilter
				:filter.sync="filter"
			/>
			<v-divider
				class="my-0 ml-2 mr-3 pa-0"
				vertical
			/>
			<DatabasesActionAdd
				@submit="showAddDatabase = true"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-4 bg-secondary fill-height custom-scrollbar"
		>
			<div class="ma-0 pa-0">
				<DatabasesDatatable
					class="ma-0 pa-0"
					:filter="filter"
					:active-database="activeDatabase"
					:items="databaseList"
					@update:use="onUseDatabase"
				/>
			</div>
		</v-card-text>

		<!-- MODALS -->
		<DatabasesModalAdd
			v-model="showAddDatabase"
			color="success"
			@submit="onAddDatabase"
		/>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
	AUTH_MODULE,
	AUTHENTICATED,
} from '@/store/auth/constants';
import {
	DATABASE_MODULE,
	FETCH_DATABASE_LIST,
	SET_DATABASE_LIST,
	ADD_DATABASE,
	USE_DATABASE,
	DATABASE_LIST,
} from '@/store/database/constants';
import {
	IMMUDB_MODULE,
	FETCH_STATE,
	STATE,
} from '@/store/immudb/constants';
import {
	mdiDatabaseCogOutline,
} from '@mdi/js';

export default {
	name: 'Databases',
	async fetch () {
		await this.fetchState();
		await this.fetchDatabaseList();
	},
	data () {
		return {
			mdiDatabaseCogOutline,
			filter: '',
			showAddDatabase: false,
		};
	},
	computed: {
		...mapGetters(AUTH_MODULE, {
			authenticated: AUTHENTICATED,
		}),
		...mapGetters(IMMUDB_MODULE, {
			state: STATE,
		}),
		...mapGetters(DATABASE_MODULE, {
			databaseList: DATABASE_LIST,
		}),
		activeDatabase () {
			if (this.state) {
				const { db } = this.state;
				return db;
			}
			return '';
		},
	},
	watch: {
		authenticated: {
			deep: true,
			handler (newVal) {
				if (newVal) {
					this.fetchDatabaseList();
				}
				else {
					this.setDatabaseList({ databases: [] });
				}
			},
		},
	},
	methods: {
		...mapActions(IMMUDB_MODULE, {
			fetchState: FETCH_STATE,
		}),
		...mapActions(DATABASE_MODULE, {
			fetchDatabaseList: FETCH_DATABASE_LIST,
			setDatabaseList: SET_DATABASE_LIST,
			addDatabase: ADD_DATABASE,
			useDatabase: USE_DATABASE,
		}),
		async onAddDatabase (data) {
			try {
				await this.addDatabase(data);
				await this.fetchState();
				await this.fetchDatabaseList();
				this.$toasted.success(this.$t('databases.action.add.success'), {
					duration: 3000,
					icon: 'check-circle',
				});
			}
			catch (err) {
				this.showToastError(err);
			}
		},
		async onUseDatabase (data) {
			console.log('use', data);
			try {
				await this.useDatabase(data);
				await this.fetchState();
				await this.fetchDatabaseList();
				this.$toasted.success(this.$t('databases.table.action.use.success'), {
					duration: 3000,
					icon: 'check-circle',
				});
			}
			catch (err) {
				this.showToastError(err);
			}
		},
	},
};
</script>

<style lang="scss">
#Databases {
	&.pane {
		&::after {
			content: '';
			position: absolute;
			top: calc(#{$spacer-12} + 1px);
			right: calc(#{$spacer-4} + 1px);
			bottom: 0;
			left: 1px;
			pointer-events: none !important;
		}

		&.theme-- {
			&light {
				&::after {
					outline: 1px solid rgba(0, 0, 0, 0.05);
				}
			}
		}
	}
}
</style>
