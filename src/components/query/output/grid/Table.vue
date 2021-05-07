<template>
	<div
		id="OutputGridTable"
		class="my-2 mx-0 pa-0 fill-height"
	>
		<v-simple-table class="sql-table ma-0 pa-0 bg-secondary">
			<template #default>
				<thead>
					<tr>
						<th
							v-for="(column, idx) in columns"
							:key="`column-${ uid } }-${ idx }`"
							class="text-left"
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
							v-for="(value, idx2) in row.values"
							:key="`value-${ uid } }-${ idx2 }`"
						>
							{{ extractValue(value) }}
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
				return columns && columns.map((_) => {
					return _ && _.name
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
				return rows;
			}
			return [];
		},
	},
	methods: {
		extractValue (data) {
			try {
				return data.n || data.s;
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
	border: 1px solid rgba(255, 255, 255, 0.25);
	border-radius: $spacer-1;

	.sql-table {
		th {
			font-weight: 700 !important;
		}

		th,
		td {
			border-left: 1px solid rgba(255, 255, 255, 0.25);
		}
	}
}
</style>
