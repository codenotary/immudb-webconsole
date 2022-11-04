<template>
	<v-tooltip
		content-class="ma-0 py-2 px-4 bg primary-outlined arrow-bottom-right"
		top
		:open-delay="300"
		:nudge-top="6"
	>
		<template #activator="{ on, attrs }">
			<v-btn
				href="https://discord.gg/ThSJxNEHhZ"
				class="ma-0 pl-2 text-none white--text caption elevation-2"
				color="grey"
				target="_blank"
				rel="noopener"
				small
				v-bind="attrs"
				v-on="on"
			>
				<v-icon
					:size="18"
					color="white"
				>
					{{ mdiDiscord }}
				</v-icon>
				<v-divider
					class="my-0 ml-2 pa-0"
					vertical
				/>
				<span class="ml-2 d-flex justify-start align-center white--text">Discord</span>
			</v-btn>
		</template>
		<span class="body-2">
			{{ $t('footer.github.tooltip') }}
		</span>
	</v-tooltip>
</template>

<script>
import { mdiDiscord } from '@mdi/js';

export default {
	name: 'UiActionDiscordBtn',
	data: () => ({ mdiDiscord }),
};
</script>
