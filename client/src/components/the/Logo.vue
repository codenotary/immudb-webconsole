<template>
	<section class="logo-wrapper fill-width">
		<div
			v-if="text"
			style="position: relative;"
			:class="`d-flex ${ getAlign } ${ mini ? '' : 'mt-6' }`"
		>
			<v-img
				class="logo mr-2"
				:src="getAsset"
				:class="getLogoSize"
				:alt="getAlt"
				contain
			/>
			<span
				v-if="text"
				class="text--logo"
				:class="[getTextSize, getTextColor]"
			>
				{{ text }}
			</span>
		</div>
		<div
			v-else
			:class="`d-flex ${ getAlign }`"
		>
			<v-img
				class="logo"
				:src="getAsset"
				:class="getLogoSize"
				:alt="getAlt"
				contain
			/>
		</div>
	</section>
</template>

<script>
export default {
	name: 'TheLogo',
	props: {
		svg: { type: Boolean, default: false },
		align: { type: String, default: 'left' },
		size: { type: String, default: 'normal' },
		text: { type: String, default: '' },
		mini: { type: Boolean, default: false },
		company: { type: String, default: 'opvizor' },
	},
	computed: {
		getAlt () {
			return 'CodeNotary - Timestamp Service';
		},
		getSize () {
			return this.size || 'normal';
		},
		getTheme () {
			return this.$vuetify.theme.dark ? 'dark' : 'light';
		},
		getMime () {
			return this.svg ? 'svg' : 'png';
		},
		getAsset () {
			return require(`@/static/images/logo/logo_${ (this.text ? 'text_' : '') }${ this.getTheme }_${ (this.mini ? 'icon' : '') }.${ this.getMime }`);
		},
		getTextColor () {
			return 'text--blue';
		},
		getAlign () {
			return this.align === 'center' ? 'justify-center' : 'justify-start';
		},
		getLogoSize () {
			return `logo--${ this.mini ? 'mini--' : '' }${ this.getSize }`;
		},
		getTextSize () {
			return `text--${ this.mini ? 'mini--' : '' }${ this.getSize }`;
		},
	},
};
</script>

<style lang="scss">
section.logo-wrapper {
	height: auto;

	.logo:focus {
		outline: 0 !important;
		border: none !important;
	}

	.logo-- {
		object-fit: contain;

		&smallest {
			max-width: 104.5px !important;
			height: 23.05px;
		}

		&small {
			max-width: 139.5px !important;
			height: 30.75px;
		}

		&normal {
			max-width: 186px !important;
			height: 54px;
		}

		&big {
			max-width: 248px !important;
			height: 54.5px;
		}

		&mini-- {
			&smallest {
				max-width: 32px !important;
				height: 32px;
			}

			&small {
				max-width: 40px !important;
				height: 40px;
			}

			&normal {
				// if also text is shown
				// max-width: 20px !important;
				// height: 20px;
				max-width: 48px !important;
				height: 48px;
			}

			&big {
				max-width: 64px !important;
				height: 64px;
			}
		}
	}

	.text-- {
		&smallest {
			position: absolute;
			font-size: 7px;
			top: 34px;
			left: 26px;
		}

		&small {
			position: absolute;
			font-size: 9px;
			top: 38px;
			left: 36px;
		}

		&normal {
			position: absolute;
			font-size: 10px;
			top: 46px;
			left: 46px;
		}

		&big {
			position: absolute;
			font-size: 14px;
			top: 56px;
			left: 62px;
		}

		&mini-- {
			&small {
				position: absolute;
				font-size: 9px;
				top: 38px;
				left: 16px;
			}

			&normal {
				position: absolute;
				font-size: 10px;
				top: 36px;
				left: 24px;

				&.second-row {
					top: 46px;
					left: 14px;
				}
			}

			&big {
				position: absolute;
				font-size: 14px;
				top: 56px;
				left: 16px;
			}
		}

		&white {
			color: #fff !important;
		}

		&blue {
			color: #00bedd !important;
		}
	}
}
</style>
