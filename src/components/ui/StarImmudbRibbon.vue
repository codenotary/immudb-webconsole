<template>
	<a
		class="ma-0 py-4 px-3 angled-ribbon"
		href="https://github.com/codenotary/immudb"
		target="_blank"
		alt="Star immudb on Github"
		rel="noopener"
	>
		<span class="body-2">
			<v-icon
				class="ma-0 mr-1 body-2 "
			>
				{{ mdiStar }}
			</v-icon>
			<i18n
				class="body-2"
				tag="span"
				path="ribbon.text"
			>
				<template v-slot:what>
					<strong>immudb</strong>
				</template>
			</i18n>
		</span>
	</a>
</template>

<script>
import {
	mdiStar,
} from '@mdi/js';

export default {
	name: 'UiStarImmudbRibbon',
	data () {
		return {
			mdiStar,
		};
	},
};
</script>

<style lang="scss">
$backgroundColor: '/images/ribbon_blue.jpg';

a.angled-ribbon {
	position: absolute;
	top: 0;
	right: 0;
	background-image: url($backgroundColor);
	background-size: cover;
	transform: translateX(30%) translateY(0%) rotate(45deg);
	transform-origin: top left;
	text-decoration: none !important;
	z-index: 99;

	span {
		color: #ccc;
		font-weight: 700;
	}

	&:hover,
	&:active {
		span {
			color: #f1f1f1;

			svg {
				path {
					fill: #ffce6e;
				}
			}
		}
	}

	&::before,
	&::after {
		content: "";
		position: absolute;
		top: 0;
		height: 100%;
		width: 100%;
		margin: 0 -1px;
		background-image: url($backgroundColor);
		background-size: cover;
	}

	&::before {
		right: 100%;
		padding: 0;
	}

	&::after {
		left: 100%;
	}
}
</style>
