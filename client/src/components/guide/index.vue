<template>
	<v-card
		id="Guide"
		class="ma-0 pa-0 bg fill-height shadow"
		elevation="0"
	>
		<v-card-title class="ma-0 py-0 py-sm-2 px-0 d-flex justify-start align-center">
			<v-icon
				class="ml-2 title"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ mdiBookOpenOutline }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 title"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('guide.title') }}
			</h4>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-secondary custom-scrollbar"
		>
			<v-row class="ma-0 pa-4">
				<v-col
					class="ma-0 pa-0 d-flex justify-start align-center"
					cols="12"
				>
					<v-row class="ma-0 mb-2 pa-0">
						<v-col
							class="ma-0 pa-0 d-flex justify-start align-center"
							cols="12"
							sm="6"
						>
							<p
								v-if="title"
								class="ma-0 pa-0 d-flex justify-start align-baseline subtitle-2"
								v-html="title"
							/>
							<v-skeleton-loader
								v-else
								class="ma-0 ml-n2 pa-0"
								width="40%"
								:height="16"
								type="image"
							/>
						</v-col>
						<v-col
							class="ma-0 pa-0"
							cols="12"
							sm="6"
						>
							<v-row class="ma-0 pa-0">
								<v-col
									class="ma-0 pa-0 d-flex justify-end align-center"
									cols="12"
								>
									<v-btn
										v-if="documentation"
										class="ma-0 py-0 px-3 caption"
										style="height: 22px !important;"
										text
										depressed
										color="info lighten-1"
										:href="documentation"
										:alt="$t('code.seeInDocumentation')"
										target="_blank"
										rel="noopener"
										x-small
										dense
									>
										<v-icon
											left
											small
										>
											{{ mdiBook }}
										</v-icon>
										<span class="caption">
											{{ $t('code.seeInDocumentation') }}
										</span>
									</v-btn>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-col>
				<v-col
					class="ma-0 pa-0"
					cols="12"
				>
					<v-divider
						class="ma-0 pa-0"
					/>
				</v-col>
				<v-col
					class="ma-0 mb-4 pa-0"
					cols="12"
				>
					<!-- <div
						v-if="markdown"
						class="github-markdown"
						v-html="$md.render(markdown)"
					/> -->
					<nuxt-content
						v-if="guide"
						class="github-markdown"
						:document="guide"
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
	GUIDE_MODULE,
	ACTIVE_GUIDE,
} from '@/store/guide/constants';
import { metaTitle } from '@/helpers/meta';
import Prism from '@/plugins/vue-prism-editor';
import {
	mdiBook,
	mdiBookOpenOutline,
} from '@mdi/js';

export default {
	name: 'Guide',
	data () {
		return {
			mdiBook,
			mdiBookOpenOutline,
		};
	},
	computed: {
		...mapGetters(VIEW_MODULE, {
			loading: IS_LOADING,
		}),
		...mapGetters(GUIDE_MODULE, {
			activeGuide: ACTIVE_GUIDE,
		}),
		title () {
			if (this.activeGuide) {
				const { title } = this.activeGuide;
				return title || '';
			}
			return '';
		},
		documentation () {
			if (this.activeGuide) {
				const { documentation } = this.activeGuide;
				return documentation || '';
			}
			return '';
		},
		guide () {
			if (this.activeGuide) {
				const { guide } = this.activeGuide;
				return guide || {};
			}
			return {};
		},
	},
	mounted() {
		Prism.highlightAll();
	},
	head () {
		if (this.guide) {
			const { title } = this.guide;

			return {
				title: metaTitle(title),
			};
		};
	},
};
</script>
