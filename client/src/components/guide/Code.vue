<template>
	<div
		class="guide-code-block ma-0 mb-4 py-2 px-4 bg-code d-flex flex-column justify-space-between align-center"
		:class="`language-${ language }`"
	>
		<span
			v-for="(item, idx) in data"
			:key="idx"
			class="ma-0 pa-0 d-flex flex-row justify-start align-center fill-width"
		>
			<span
				class="ma-0 pa-0 white--text"
				style="width: 33%;"
			>
				{{ item.prompt }}
			</span>
			<span class="ma-0 pa-0 grey--text text--darken-2">
				|
			</span>
			<prism-editor
				class="ma-0 ml-2 pa-0 pr-12"
				:code="item.code.trim()"
				:language="language"
				:readonly="false"
			/>
			<v-btn
				v-if="runnable"
				class="run"
				color="success lighten-2"
				depressed
				icon
				@click="onRun(item)"
			>
				<v-icon :size="24">
					{{ mdiPlayCircleOutline }}
				</v-icon>
			</v-btn>
			<v-btn
				v-else
				class="copy"
				color="blue lighten-2"
				depressed
				icon
				medium
				@click="onCopy(item.code.trim())"
			>
				<v-icon :size="20">
					{{ mdiContentCopy }}
				</v-icon>
			</v-btn>
		</span>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import {
	LIVE_MODULE,
	SET_COMMAND,
} from '@/store/live/constants';
import {
	WEBSOCKET_MODULE,
	SOCKET_OBJ_MESSAGE,
} from '@/store/websocket/constants';
import {
	mdiContentCopy,
	mdiPlayCircleOutline,
} from '@mdi/js';
import copy from 'copy-to-clipboard';

export default {
	name: 'GuideCode',
	props: {
		language: { type: String, default: 'bash' },
		data: { type: Array, default: () => [] },
		runnable: { type: Boolean, default: false },
	},
	data () {
		return {
			mdiContentCopy,
			mdiPlayCircleOutline,
		};
	},
	methods: {
		...mapActions(LIVE_MODULE, {
			setCommand: SET_COMMAND,
		}),
		...mapActions(WEBSOCKET_MODULE, {
			sendObj: SOCKET_OBJ_MESSAGE,
		}),
		onCopy (data) {
			copy(data);
			this.$toasted.success(`Copied code '${ data }' to clipboard`, { icon: 'check-circle' });
		},
		onRun (data) {
			const { code } = data;
			try {
				this.setCommand(code && code.trim());
			}
			catch (err) {
				console.error(err);
			}
		},
	},
};
</script>

<style lang="scss">
.guide-code-block {
	border-radius: 4px;

	pre {
		padding: 0 !important;

		code {
			min-height: $spacer-4 !important;
		}
	}
}
</style>
