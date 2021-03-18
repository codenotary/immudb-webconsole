<template>
	<v-card
		id="Guide"
		class="ma-0 pa-0 bg fill-height shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-start align-center">
			<h4
				v-if="title"
				class="ma-0 ml-2 pa-0 title"
				v-html="title"
			/>
			<v-skeleton-loader
				v-else
				class="ma-0 ml-n2 pa-0"
				width="80%"
				:height="16"
				type="image"
			/>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-secondary custom-scrollbar"
		>
			<v-row
				class="ma-0 pa-4"
			>
				<v-col
					class="ma-0 mb-4 pa-0"
					cols="12"
				>
					<v-row class="ma-0 pa-0">
						<v-col
							class="ma-0 pa-0 d-flex justify-end align-center"
							cols="12"
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
						v-html="description"
					/>
					<v-skeleton-loader
						v-else
						class="ma-0 ml-n2 pa-0"
						width="80%"
						:height="16"
						type="image"
					/>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import {
	VIEW_MODULE,
	IS_LOADING,
} from '@/store/view/constants';
import {
	EXAMPLE_MODULE,
	ACTIVE_EXAMPLE,
} from '@/store/example/constants';
import { mdiBook } from '@mdi/js';
import sanitizeHtml from 'sanitize-html';

export default {
	name: 'Guide',
	data () {
		return {
			mdiBook,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			loading: IS_LOADING,
		}),
		...mapGetters(EXAMPLE_MODULE, {
			activeExample: ACTIVE_EXAMPLE,
		}),
		title () {
			if (this.activeExample) {
				const { title } = this.activeExample;
				return sanitizeHtml(title) || '';
			}
			return '';
		},
		description () {
			if (this.activeExample) {
				const { description } = this.activeExample;
				return sanitizeHtml(description) || '';
			}
			return '';
		},
		documentationUrl () {
			if (this.activeExample) {
				const { documentation } = this.activeExample;
				return documentation || '';
			}
			return '';
		},
	},
};
</script>

<style lang="scss">
#Guide {
	&.v-card {
		.v-card__title {
			height: 44px !important;

			@media (max-width: 480px) {
				height: 32px !important;
			}
		}

		.v-card__text {
			height: calc(100% - 44px) !important;
		}
	}
}
</style>
