<template>
	<v-row class="ma-0 pa-0">
		<v-col
			class="ma-0 mb-4 pa-0"
			cols="12"
		>
			<v-row class="ma-0 pa-0">
				<v-col
					class="ma-0 pa-0 d-flex justify-start align-center"
					cols="12"
					sm="8"
				>
					<h4
						v-if="title"
						class="ma-0 pa-0 title"
						v-dompurify-html="title"
					/>
					<v-skeleton-loader
						v-else
						class="ma-0 ml-n2 pa-0"
						width="80%"
						:height="16"
						type="image"
					/>
				</v-col>
				<v-col
					class="ma-0 pa-0 d-flex justify-end align-center"
					cols="12"
					sm="4"
				>
					<v-btn
						v-if="documentationUrl"
						class="ma-0 py-0 px-3 body-2"
						outlined
						depressed
						color="accent darken-1"
						:href="documentationUrl"
						:alt="$t('code.seeInDocumentation')"
						target="_blank"
						rel="noopener"
						small
					>
						<v-icon left>
							{{ mdiBook }}
						</v-icon>
						<span class="body-2">
							{{ $t('code.seeInDocumentation') }}
						</span>
					</v-btn>
				</v-col>
			</v-row>
		</v-col>
		<v-col
			class="ma-0 mb-4 pa-0"
			cols="12"
		>
			<p
				v-if="description"
				class="ma-0 pa-0 body-2"
				v-dompurify-html="description"
			/>
			<v-skeleton-loader
				v-else
				class="ma-0 ml-n2 pa-0"
				width="80%"
				:height="16"
				type="image"
			/>
		</v-col>
		<v-col
			class="ma-0 pa-0"
			cols="12"
		>
			<v-divider
				class="ma-0 pa-0"
				style="width: 80%;"
			/>
		</v-col>
	</v-row>
</template>

<script>
import { mdiBook } from '@mdi/js';

export default {
	name: 'CodeDetail',
	props: {
		title: { type: String, default: '' },
		description: { type: String, default: '' },
		documentationUrl: { type: String, default: '' },
	},
	data () {
		return {
			mdiBook,
		};
	},
};
</script>

<style lang="scss">
#CodeDetail {
	//
}
</style>
