<template>
	<v-card
		id="Live"
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
				{{ mdiConsoleLine }}
			</v-icon>
			<h4
				class="ma-0 ml-2 pa-0 title"
				:class="{
					'gray--text text--darken-1': !$vuetify.theme.dark,
					'gray--text text--lighten-1': $vuetify.theme.dark,
				}"
			>
				{{ $t('live.title') }}
			</h4>
		</v-card-title>
		<v-card-text
			class="ma-0 pa-0 bg-terminal"
		>
			<div class="command-line-wrapper ma-0 pa-0">
				<vue-command
					id="LiveCommandLine"
					ref="terminal"
					class="ma-0 pa-0 custom-scrollbar"
					:title="title"
					:prompt="prompt"
					:commands="commands"
					:history.sync="history"
					:stdin.sync="termStdin"
					:is-in-progress="!showPrompt"
					:hide-prompt="showPrompt"
					@executed="onExecute($event)"
					@keydown.enter.native.stop.prevent="onExecute"
				/>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import { createStdout, createStderr } from 'vue-command';
import {
	mdiConsoleLine,
} from '@mdi/js';
import LiveIntro from '@/components/live/Intro';

export default {
	name: 'Live',
	data () {
		return {
			mdiConsoleLine,
			title: 'immuclient',
			prompt: 'demo@user: #',
			intro: {
				value: '',
			},
			introFinished: false,
			commands: {
				intro: () => undefined,
			},
			termStdin: '',
			history: [],
		};
	},
	computed: {
		showPrompt () {
			return !this.introFinished;
		},
	},
	mounted () {
		this.$options.sockets.onmessage = (data) => {
			const msg = JSON.parse(event.data);
			if (this.introFinished) {
				this.appendOutput(msg.line, msg.flux === 'stderr', true);
			}
			else if (msg && msg.line === '--MARK--\n') {
				this.introFinished = true;
			}
			else {
				this.appendIntro(msg.line, msg.flux === 'stderr');
			}
		};

		this.$nextTick(() => {
			this.history = [LiveIntro];
		});
	},
	created () {
		this.commands.intro = () => {
			return LiveIntro;
		};
	},
	beforeDestroy () {
		delete this.$options.sockets.onmessage;

		if (this.$refs.vueCommand) {
			this.$refs.vueCommand.scroll.resizeObserver.disconnect();
		}
	},
	provide () {
		return {
			intro: this.intro,
		};
	},
	methods: {
		appendIntro (line, stderr = false) {
			const newLine = `<span class="${ stderr ? 'stderr' : 'stdout' }">${ line }</span>`;
			this.intro.value = `${ this.intro.value }${ this.intro.value && '<br>' }${ newLine }`;
		},
		appendOutput (line, stderr = false, intro = false) {
			console.log('appenOutput:', line);

			this.$refs.terminal.setIsInProgress(true);
			this.history
					.push(
						intro
							? createStdout(line)
							: stderr
								? createStderr(line)
								: createStdout(line),
					);
			this.$refs.terminal.setIsInProgress(false);
		},
		onExecute (data) {
			this.$socket && this.$socket.sendObj(data);
		},
	},
};
</script>

<style lang="scss">
#Live {
	&.v-card {
		.v-card__title {
			height: 44px !important;

			@media (max-width: 480px) {
				height: 32px !important;
			}
		}

		.v-card__text {
			height: calc(100% - 44px) !important;

			.command-line-wrapper {
				&,
				.vue-command {
					height: 100%;
				}

				.vue-command {
					.term-std {
						min-height: 100%;
						height: unset;
					}

					.term-cont {
						.term-hist {
							margin: $spacer-4 0;

							.term-stdout,
							.term-stderr {
								word-wrap: break-word;
								white-space: normal;
							}
						}
					}
				}
			}
		}
	}
}
</style>
