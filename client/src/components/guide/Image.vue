<template>
	<img
		:src="imgSrc()"
		:alt="alt"
		:style="getStyle"
	>
</template>

<script>
export default {
	name : 'GuideImage',
	props: {
		src: {
			type: String,
			required: true,
		},
		alt: {
			type: String,
			required: true,
		},
		/* eslint-disable vue/require-default-prop */
		height: {
			type: Number,
		},
		minHeight: {
			type: Number,
		},
		maxHeight: {
			type: Number,
		},
		width: {
			type: Number,
		},
		minWidth: {
			type: Number,
		},
		maxWidth: {
			type: Number,
		},
		objectFit: {
			type: String,
			default: 'contain',
		},
		/* eslint-enable vue/require-default-prop */
	},
	computed: {
		getStyle () {
			let style = '';
			this.height && (style += `; height: ${ this.height }`);
			this.minHeight && (style += `; minHeight: ${ this.minHeight }`);
			this.maxHeight && (style += `; maxHeight: ${ this.maxHeight }`);
			this.width && (style += `; width: ${ this.width }`);
			this.minWidth && (style += `; minWidth: ${ this.minWidth }`);
			this.maxWidth && (style += `; maxWidth: ${ this.maxWidth }`);
			this.objectFit && (style += `; object-fit: ${ this.objectFit }`);
			return style;
		},
	},
	methods: {
		imgSrc() {
			try {
				return require(`~/assets/images/help${ this.src }`);
			}
			catch (err) {
				console.error(err);
				return null;
			}
		},
	},
};
</script>
