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
				href="https://discord.gg/ThSJxNEHhZ"
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
					{{ mdiDiscord }}
				</v-icon>
			</v-btn>
		</template>
		<span class="body-2">
			{{ $t('footer.github.tooltip') }}
		</span>
	</v-tooltip>
</template>
