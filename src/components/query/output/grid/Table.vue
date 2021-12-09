<template>
	<div
		id="OutputGridTable"
		class="my-2 mx-0 pa-0 fill-height"
		:class="`query-wrapper ma-0 pa-0 theme--${ $vuetify.theme.dark
			? 'dark'
			: 'light'
		}`"
	>
		<v-simple-table class="sql-table ma-0 pa-0 bg-secondary custom-scrollbar">
			<template #default>
				<thead>
					<tr>
						<th
							v-for="(column, idx) in columns"
							:key="`column-${ uid } }-${ idx }`"
							class="text-left"
							:class="{
								'gray--text text--lighten-1': !$vuetify.theme.dark,
								'gray--text text--lighten-4': $vuetify.theme.dark,
							}"
						>
							{{ column }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(row, idx) in rows"
						:key="`row-${ uid } }-${ idx }`"
						class="bg-secondary"
					>
						<td
							v-for="(value, idx2) in row"
							:key="`value-${ uid } }-${ idx2 }`"
							:class="{
								'gray--text text--darken-3': !$vuetify.theme.dark,
								'gray--text text--lighten-5': $vuetify.theme.dark,
							}"
						>
							{{ value }}
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
export default {
	name: 'QueryOutputGridTable',
	props: {
		item: { type: Object, default: () => {} },
	},
	computed: {
		uid () {
			return this._uid;
		},
		columns () {
			if (this.item) {
				const { columns } = this.item;
				return columns && columns
						.slice()
						.map((_) => {
							return _ && _.name && _.name
									.slice(1, -1)
									.replace(/\.([^.]+)$/, ':$1')
									.split(':')
									.pop();
						});
			}
			return [];
		},
		rows () {
			if (this.item) {
				const { rows } = this.item;
				return rows && rows
						.slice()
						.map(_ => _ && _ && _.values
								.map(value => this.extractValue(value)));
			}
			return [];
		},
	},
	methods: {
		extractValue (data) {
			try {
				return data.n || data.s || data.f || data.b || data.d || data.ts || data.bs;
			}
			catch (err) {
				console.error(err);
				return data;
			}
		},
	},
};
</script>

<style lang="scss">
#OutputGridTable {
	border-radius: $spacer-1;

	&.theme-- {
		&light {
			border: 1px solid rgba(0, 0, 0, 0.25) !important;
		}

		&dark {
			border: 1px solid rgba(255, 255, 255, 0.45) !important;
		}
	}

	.sql-table {
		overflow-x: hidden !important;

		th {
			font-weight: 700 !important;
		}

		&.theme-- {
			&light {
				thead tr,
				tbody tr:not(:nth-last-of-type(-n+1)) {
					th,
					td {
						border-bottom: 1px solid rgba(0, 0, 0, 0.25) !important;
					}
				}

				th:not(:first-child),
				td:not(:first-child) {
					border-left: 1px solid rgba(0, 0, 0, 0.25) !important;
				}
			}

			&dark {
				thead tr,
				tbody tr:not(:nth-last-of-type(-n+1)) {
					th,
					td {
						border-bottom: 1px solid rgba(255, 255, 255, 0.45) !important;
					}
				}

				th:not(:first-child),
				td:not(:first-child) {
					border-left: 1px solid rgba(255, 255, 255, 0.45) !important;
				}
			}
		}

		th,
		td {
			&::after {
				content: none !important;
			}
		}
	}
}
</style>
