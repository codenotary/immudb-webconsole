<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-right"
		top
		:open-delay="300"
		:nudge-top="6"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				class="github-btn pa-0 pr-2 body-2 elevation-2"
				style="margin-left: 2px;"
				color="grey lighten-5"
				depressed
				small
				href="https://github.com/codenotary/immudb"
				target="_blank"
				:title="$t('footer.github')"
				:alt="$t('footer.github')"
				rel="noopener"
				v-bind="attrs"
				v-on="on"
			>
				<v-icon
					class="ma-0 grey lighten-1 white--text"
					style="padding: 4px; margin-left: -2px !important; border-radius: 4px 0 0 4px;"
					:size="28"
				>
					{{ mdiGithub }}
				</v-icon>
				<span
					v-if="parsedStars"
					class="ml-1 pa-0 gray--text text--lighten-1 d-flex justify-start align-center font-weight-bold"
				>
					{{ parsedStars }}
				</span>
			</v-btn>
		</template>
		<span class="body-2">
			{{ $t('footer.github.tooltip') }}
		</span>
	</v-tooltip>
</template>

<script>
import {
	mdiGithub,
} from '@mdi/js';
import { GithubService } from '@/services/github';

export default {
	name: 'UiActionGithubBtn',
	async fetch() {
		await GithubService.getStars()
				.then((response) => {
					if (response && response.data) {
						const { data: { stargazers_count: stars } } = response || {};
						stars && (this.stars = `${ stars }`);
					}
				})
				.catch((err) => {
					console.error(err);
				});
	},
	data () {
		return {
			mdiGithub,
			stars: '',
		};
	},
	computed: {
		parsedStars () {
			if (this.stars && typeof this.stars === 'string') {
				return Number(this.stars).toLocaleString();
			}
			return this.stars;
		},
	},
};
</script>

<style lang="scss">
.v-btn.github-btn {
	&::before,
	&::after {
		transition: all ease-in-out 0.1s !important;
	}

	&:hover,
	&:focus {
		&,
		span,
		svg {
			color: var(--v-grey-lighten5) !important;
			fill: var(--v-grey-lighten5) !important;
		}

		&::before,
		&::after {
			background-color: var(--v-grey-lighten3) !important;
			opacity: 1 !important;
		}
	}
}
</style>
