<template>
	<div
		id="OutputCodeItem"
		class="my-2 mx-0 pa-0 pl-4 fill-height"
	>
		<div v-if="divider">
			<v-divider
				class="my-2 mx-0"
				style="opacity: 0.55;"
			/>
		</div>
		<div
			v-else
			:class="`bar-${ flux }`"
		>
			<span class="ma-0 pa-0 caption grey--text text--lighten-1">
				{{ timestamp }}
			</span>
			<span class="my-0 mx-2 pa-0">
				{{ separator }}
			</span>
			<span :class="`ma-0 mr-2 pa-0 caption stdx ${ flux }`">
				{{ flux }}
			</span>
			<span class="ma-0 pa-0 caption grey--text text--lighten-1">
				{{ line }}
			</span>
		</div>
	</div>
</template>

<script>
import timeUtils from '@/mixins/timeUtils';

export default {
	name: 'OutputCodeItem',
	mixins: [timeUtils],
	props: {
		item: { type: Object, default: () => {} },
		separator: { type: String, default: '-' },
	},
	computed: {
		flux () {
			if (this.item) {
				const { flux } = this.item;
				return flux;
			}
			return '';
		},
		line () {
			if (this.item) {
				const { line } = this.item;
				return line;
			}
			return '';
		},
		timestamp () {
			if (this.item) {
				const { timestamp } = this.item;
				return this.timestampToString(timestamp * 1000);
			}
			return '';
		},
		divider () {
			if (this.item) {
				const { divider } = this.item;
				return divider;
			}
			return false;
		},
	},
};
</script>

<style lang="scss">
#OutputCodeItem {
	position: relative;
	overflow: hidden;

	&.bar- {
		&stdout,
		&stderr {
			&::before {
				content: '';
				position: absolute;
				top: 5%;
				left: 0;
				height: 90%;
				width: 2px;
			}
		}

		&stdout {
			&::before {
				background-color: $success;
			}
		}

		&stderr {
			&::before {
				background-color: $error;
			}
		}
	}

	.stdx {
		&.stdout {
			color: $success;
		}

		&.stderr {
			color: $error;
		}
	}
}
</style>
