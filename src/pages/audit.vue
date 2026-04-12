<template>
	<v-container
		id="AuditPage"
		class="ma-0 pa-4 fill-height"
		fluid
	>
		<v-row class="ma-0 pa-0 fill-height">
			<v-col class="ma-0 pa-0" cols="12">
				<v-card class="fill-height" flat>
					<v-card-title class="d-flex justify-space-between align-center">
						<span class="headline">
							{{ $t('audit.title') }}
						</span>
						<v-btn
							color="primary"
							small
							depressed
							:loading="loading"
							@click="fetchAuditEvents"
						>
							Refresh
						</v-btn>
					</v-card-title>
					<v-card-subtitle>
						{{ $t('audit.subtitle') }}
					</v-card-subtitle>

					<!-- Filters -->
					<v-card-text class="pa-4 pb-0">
						<v-row dense>
							<v-col cols="12" sm="3">
								<v-select
									v-model="filterEventType"
									:items="eventTypeOptions"
									:label="$t('audit.filters.eventType')"
									clearable
									dense
									outlined
									hide-details
								/>
							</v-col>
							<v-col cols="12" sm="3">
								<v-text-field
									v-model="filterUser"
									:label="$t('audit.filters.user')"
									clearable
									dense
									outlined
									hide-details
								/>
							</v-col>
							<v-col cols="12" sm="3">
								<v-text-field
									v-model="filterMethod"
									:label="$t('audit.filters.method')"
									clearable
									dense
									outlined
									hide-details
								/>
							</v-col>
							<v-col cols="12" sm="3">
								<v-select
									v-model="filterLimit"
									:items="limitOptions"
									label="Limit"
									dense
									outlined
									hide-details
								/>
							</v-col>
						</v-row>
					</v-card-text>

					<!-- Events Table -->
					<v-card-text class="pa-4">
						<v-data-table
							:headers="headers"
							:items="filteredEvents"
							:loading="loading"
							:loading-text="$t('audit.loading')"
							:no-data-text="$t('audit.empty')"
							:items-per-page="25"
							:footer-props="{ 'items-per-page-options': [10, 25, 50, 100] }"
							dense
							class="elevation-0"
						>
							<template #item.event_type="{ item }">
								<v-chip
									:color="eventTypeColor(item.event_type)"
									small
									label
									dark
								>
									{{ item.event_type }}
								</v-chip>
							</template>
							<template #item.success="{ item }">
								<v-icon
									small
									:color="item.success ? 'success' : 'error'"
								>
									{{ item.success ? mdiCheckCircle : mdiCloseCircle }}
								</v-icon>
							</template>
							<template #item.duration_ms="{ item }">
								{{ item.duration_ms ? `${item.duration_ms}ms` : '-' }}
							</template>
							<template #item.error="{ item }">
								<span
									v-if="item.error"
									class="error--text caption"
								>
									{{ item.error }}
								</span>
								<span v-else class="grey--text">-</span>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	mdiCheckCircle,
	mdiCloseCircle,
} from '@mdi/js';
import {
	IMMUDB_MODULE,
} from '@/store/immudb/constants';

export default {
	name: 'AuditPage',
	data () {
		return {
			mdiCheckCircle,
			mdiCloseCircle,
			loading: false,
			events: [],
			filterEventType: null,
			filterUser: '',
			filterMethod: '',
			filterLimit: 100,
			limitOptions: [50, 100, 250, 500],
			eventTypeOptions: [
				{ text: 'All', value: null },
				{ text: 'Authentication', value: 'AUTH' },
				{ text: 'Administration', value: 'ADMIN' },
				{ text: 'Write', value: 'WRITE' },
				{ text: 'Read', value: 'READ' },
				{ text: 'System', value: 'SYSTEM' },
			],
			headers: [
				{ text: 'Timestamp', value: 'timestamp', width: '180px' },
				{ text: 'User', value: 'user', width: '120px' },
				{ text: 'IP', value: 'ip', width: '120px' },
				{ text: 'Method', value: 'method', width: '200px' },
				{ text: 'Event Type', value: 'event_type', width: '120px' },
				{ text: 'Status', value: 'success', width: '80px', align: 'center' },
				{ text: 'Duration', value: 'duration_ms', width: '100px' },
				{ text: 'Error', value: 'error' },
			],
		};
	},
	computed: {
		...mapGetters(IMMUDB_MODULE, {}),
		filteredEvents () {
			let result = this.events;
			if (this.filterEventType) {
				result = result.filter(e => e.event_type === this.filterEventType);
			}
			if (this.filterUser) {
				result = result.filter(e =>
					e.user && e.user.toLowerCase().includes(this.filterUser.toLowerCase()),
				);
			}
			if (this.filterMethod) {
				result = result.filter(e =>
					e.method && e.method.toLowerCase().includes(this.filterMethod.toLowerCase()),
				);
			}
			return result;
		},
	},
	mounted () {
		this.fetchAuditEvents();
	},
	methods: {
		eventTypeColor (type) {
			const colors = {
				AUTH: 'blue',
				ADMIN: 'purple',
				WRITE: 'orange',
				READ: 'green',
				SYSTEM: 'grey',
			};
			return colors[type] || 'grey';
		},
		async fetchAuditEvents () {
			this.loading = true;
			try {
				const response = await this.$services.immudb.sqlQuery({
					query: `SELECT * FROM _audit_events ORDER BY timestamp DESC LIMIT ${this.filterLimit}`,
				});
				if (response && response.data) {
					this.events = this.parseAuditResponse(response.data);
				}
			}
			catch (err) {
				// Fallback: try scan-based approach for audit: prefix keys
				try {
					const scanResponse = await this.$services.immudb.scan({
						prefix: 'audit:',
						limit: this.filterLimit,
						desc: true,
					});
					if (scanResponse && scanResponse.data) {
						this.events = this.parseScanResponse(scanResponse.data);
					}
				}
				catch {
					this.events = [];
				}
			}
			finally {
				this.loading = false;
			}
		},
		parseAuditResponse (data) {
			if (!data || !data.rows) {
				return [];
			}
			return data.rows.map((row) => {
				const values = row.values || [];
				return {
					timestamp: values[0] || '',
					user: values[1] || '',
					ip: values[2] || '',
					method: values[3] || '',
					event_type: values[4] || '',
					success: values[5] === true || values[5] === 'true',
					duration_ms: values[6] || 0,
					error: values[7] || '',
					session_id: values[8] || '',
				};
			});
		},
		parseScanResponse (data) {
			if (!data || !data.entries) {
				return [];
			}
			return data.entries.map((entry) => {
				try {
					const event = JSON.parse(
						typeof entry.value === 'string'
							? entry.value
							: new TextDecoder().decode(entry.value),
					);
					return {
						timestamp: event.timestamp || '',
						user: event.user || '',
						ip: event.ip || '',
						method: event.method || '',
						event_type: event.event_type || '',
						success: event.success !== false,
						duration_ms: event.duration_ms || 0,
						error: event.error || '',
						session_id: event.session_id || '',
					};
				}
				catch {
					return null;
				}
			}).filter(Boolean);
		},
	},
};
</script>

<style lang="scss" scoped>
#AuditPage {
	.v-data-table {
		.v-chip {
			font-size: 11px;
			font-weight: 600;
		}
	}
}
</style>
