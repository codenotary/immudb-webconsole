import { meta, DEFAULT_META } from './src/helpers/meta';
import * as qs from 'qs';
import Sass from 'sass';
const IS_PROD = process.env.NODE_ENV === 'production';
const EXPERIMENTAL = false && !IS_PROD;

const DEFAULT_THEME = 'dark';
const UI_THEME = process.env.UI_THEME || DEFAULT_THEME;

export default {
	/*
	** Ssr propery
	** Doc: https://nuxtjs.org/guides/configuration-glossary/configuration-ssr
	*/
	ssr: false,

	/*
	** Nuxt target
	** See https://nuxtjs.org/api/configuration-target
	*/
	target: 'static',

	/*
	** Server property
	** See https://nuxtjs.org/api/configuration-server
	*/
	server: {
		host: IS_PROD && process.env.HOST || '0.0.0.0',
		port: IS_PROD && process.env.PORT || 8080,
	},

	/*
	** Auto import components
	** See https://nuxtjs.org/api/configuration-components
	*/
	components: [
		{ path: '~/components' },
	],

	/*
	** Nuxt rootDir value
	** See https://nuxtjs.org/api/configuration-srcdir
	*/
	srcDir: 'src/',

	/*
	Production tip enabled
	*/
	productionTip: true,

	/*
	** Devtools enabled
	** See https://https://nuxtjs.org/api/configuration-srcdir
	*/
	devtools: !IS_PROD,

	/*
	** Headers of the page
	** See https://nuxtjs.org/api/configuration-head
	*/
	head: {
		htmlAttrs: { lang: 'en-GB' },
		title: DEFAULT_META.TITLE,
		meta: [
			{ charset: 'utf-8' },
			...meta(),
			{ name: 'HandheldFriendly', content: 'True' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			// Open Graph Data
			{ property: 'og:site_name', content: DEFAULT_META.SITE_NAME },
			// Twitter Card
			{ name: 'twitter:site', content: DEFAULT_META.HANDLE },
			{ name: 'twitter:card', content: 'summary_large_image' },
		],
		link: [
			{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
			{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
			{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'manifest', href: '/site.webmanifest' },
			{ hid: 'canonical', rel: 'canonical', href: DEFAULT_META.SITE_URL },
		],
		script: [
			{ src: '/', type: 'text/javascript', charset: 'utf-8', defer: true },
		],
	},

	/*
	** Global CSS
	*/
	css: [
		{
			src: './assets/css/main.scss',
			lang: 'scss',
			ssr: false,
		},
		{
			src: './assets/css/scrollbar.scss',
			lang: 'scss',
			ssr: false,
		},
		{
			src: 'vue-json-pretty/lib/styles.css',
			lang: 'css',
			ssr: false,
		}
	],

	/*
	** Build configuration
	** See https://nuxtjs.org/api/configuration-build/
	*/
	build: {
		analyze: false,
		parallel: EXPERIMENTAL,
		cache: EXPERIMENTAL,
		hardSource: EXPERIMENTAL,
		filenames: {
			app: IS_PROD ? '[chunkhash].js' : '[name].[hash].js',
			chunk: IS_PROD ? '[chunkhash].js' : '[name].[hash].js',
		},
		extractCSS: IS_PROD,
		// Extend webpack config
		extend(config, {isDev, isClient}) {
			// image-webpack-loader
			config.module.rules.forEach(rule => {
				if (String(rule.test) === String(/\.(png|jpe?g|gif|svg|webp)$/)) {
					// add a second loader when loading images
					rule.use.push({
						loader: 'image-webpack-loader',
						options: {
							svgo: {
							plugins: [
								// use these settings for internet explorer for proper scalable SVGs
								// https://css-tricks.com/scale-svg/
								{ removeViewBox: false },
								{ removeDimensions: true }
							]
							}
						}
					});
				}
			});
		},
		loaders: {
			vue: {
				prettify: false,
			},
			sass: {
				implementation: Sass,
			},
		},
		transpile: [
			'/^vuetify/',
			'vee-validate',
			'vue-worker',
		],
		optimization: {
			splitChunks: {
				chunks: 'async',
			},
		},
	},

	/*
	** Serve static assets with cache policy
	** Doc: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-render/
	*/
	render: {
		static: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	},

	/*
	** Set authenticated as default middleware
	** Doc: https://nuxtjs.org/guides/configuration-glossary/configuration-router
	*/
	router: {
		mode: 'history',
		middleware: [],
		base: '/',
	},

	/*
	** https://nuxtjs.org/guide/plugins
	*/
	plugins: [
		{ src: '~/plugins/vue-clipboards.js', ssr: false },
		{ src: '~/plugins/vue-cookies.js', ssr: false },
		{ src: '~/plugins/vue-gtag.js', ssr: false },
		{ src: '~/plugins/vue-json-pretty.js', ssr: false },
		{ src: '~/plugins/vue-native-websocket.client.js', ssr: false },
		{ src: '~/plugins/vue-prism-editor.js', ssr: false },
		{ src: '~/plugins/vue-toasted.js', ssr: false },
		{ src: '~/plugins/vee-validate.js', ssr: false },
		{ src: '~/plugins/vue-worker.js', ssr: false },
	],

	/*
	** Nuxt.js dev-modules
	*/
	buildModules: [
		'@nuxtjs/style-resources',
		// Doc: https://github.com/nuxt-community/eslint-module
		'@nuxtjs/eslint-module',
		// Doc: https://github.com/nuxt-community/stylelint-module
		'@nuxtjs/stylelint-module',
		// Doc: https://github.com/nuxt-community/vuetify-module
		'@nuxtjs/vuetify',
		// Doc: https://i18n.nuxtjs.org/
		'nuxt-i18n',
	],

	/*
	** Nuxt.js modules
	*/
	modules: [
		// Doc: https://axios.nuxtjs.org/setup
		'@nuxtjs/axios',
		// Doc: https://github.com/robcresswell/nuxt-compress
		['nuxt-compress',
			{
				gzip: {
					cache: true
				},
				brotli: {
					threshold: 10240
				}
			}
		],
		// Doc: https://gitlab.com/broj42/nuxt-cookie-control
		'nuxt-cookie-control',
		// Doc: https://github.com/GrabarzUndPartner/nuxt-font-loader-strategy
		['nuxt-font-loader-strategy', { 
			useWorker: false,
			ignoreLighthouse: true,
			ignoredEffectiveTypes: ['2g', 'slow-2g'],
			fonts: [
				// Roboto
				{
					fileExtensions: ['woff2', 'woff'],
					fontFamily: 'Roboto',
					fontFaces: [
						// Font-Face
						{
							preload: false,
							src: 'typeface-roboto/files/roboto-latin-100',
							fontWeight: 100,
							fontStyle: 'normal'
						},
						// Font-Face
						{
							preload: false,
							src: 'typeface-roboto/files/roboto-latin-300',
							fontWeight: 300,
							fontStyle: 'normal'
						},
						// Font-Face
						{
							preload: true,
							src: 'typeface-roboto/files/roboto-latin-400',
							fontWeight: 400,
							fontStyle: 'normal'
						},
						// Font-Face
						{
							preload: true,
							src: 'typeface-roboto/files/roboto-latin-500',
							fontWeight: 500,
							fontStyle: 'normal'
						},
						// Font-Face
						{
							preload: true,
							src: 'typeface-roboto/files/roboto-latin-700',
							fontWeight: 700,
							fontStyle: 'normal'
						},
						// Font-Face
						{
							preload: false,
							src: 'typeface-roboto/files/roboto-latin-900',
							fontWeight: 900,
							fontStyle: 'normal'
						},																														
					],
				},
			],
		}],
		// Doc: https://github.com/Developmint/nuxt-purgecss
		// [
		// 	'nuxt-purgecss', {
		// 		paths: [
		// 			'node_modules/@nuxtjs/vuetify/**/*.ts',
		// 			'node_modules/@nuxt/vue-app/template/**/*.html',
		// 			'node_modules/@nuxt/vue-app/template/**/*.vue',
		// 		],
		// 		whitelist: [
		// 			'v-application',
		// 			'v-application--wrap',
		// 		],
		// 		whitelistPatterns: () => [
		// 			/^v-((?!application).)*$/,
		// 			/^\.theme--light*/,
		// 			/.*-transition/,
		// 		],
		// 		whitelistPatternsChildren: [/^v-((?!application).)*$/, /^theme--light*/],
		// 	},
		// ],
		'nuxt-responsive-loader',
	],

	/*
	** The env Property
	** https://nuxtjs.org/api/configuration-env/
	*/
	env: {
		UI_THEME,
		API_URL: process.env.API_URL || '/api/v1/',
		GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || '',
		GOOGLE_ANALYTICS_SITEKEY: process.env.GOOGLE_ANALYTICS_SITEKEY || '',
	},

	/*
	** Development proxies
	** Doc: https://github.com/nuxt-community/proxy-module
	*/
	proxy: {
		// LOCAL ----------
		'/api/v1/': {
			target: 'http://localhost:7771',
			pathRewrite: { '^/api/v1/': '/api/v1/' },
			xfwd: true,
		},
		// REMOTE ----------
		'/remote/api/v1/': {
			target: `${ process.env.REMOTE_URL }:7771`,
			pathRewrite: { '^/remote/api/v1/': '/api/v1/' },
			xfwd: true,
		},
	},

	axios: {
		baseURL: process.env.API_URL || '/api/v1',
		proxy: true,
		returnRejectedPromiseOnError: true,
		timeout: 30000,
		paramsSerializer: params => qs.stringify(params, { indices: false }),
		headers: {
			common: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
				'Pragma': 'no-cache',
				'Accept': 'application/json',
			},
		},
	},

	/*
	** vuetify module configuration
	** https://github.com/nuxt-community/vuetify-module
	*/
	vuetify: {
		customVariables: [
			'./src/assets/css/typography.scss',
			'./src/assets/css/variables.scss',
			'./src/assets/css/spacer.scss',
		],
		treeShake: IS_PROD,
		icons: {
			iconfont: 'mdiSvg',
		},
		defaultAssets: {
			font: false,
			icons: false,
		},
		theme: {
			options: {
				customProperties: true,
				variations: true,
			},
			dark: UI_THEME === 'dark',
			themes: {
				light: {
					primary: '#1976d2',
					secondary: '#424242',
					accent: '#82b1ff',
					error: '#ff5252',
					info: '#2196f3',
					success: '#4caf50',
					warning: '#fb8c00',
					gray: '#9e9e9e',
					grey: '#9e9e9e',
					bg: '#f5f5f5',
					'bg-secondary': '#fff',
					'bg-tertiary': '#f9fcff',
					'font-700': '#111',
					'font-500': '#333',
					'font-400': '#999',
					'font-300': '#666',
					'font-200': '#f1f1f1',
					'font-100': '#fff',
				},
				dark: {
					primary: '#1976d2',
					secondary: '#424242',
					accent: '#82b1ff',
					error: '#ff5252',
					info: '#2196f3',
					success: '#4caf50',
					warning: '#fb8c00',
					gray: '#9e9e9e',
					grey: '#9e9e9e',
					bg: '#21222c',
					'bg-secondary': '#282a35',
					'bg-tertiary': '#45475b',
					'font-700': '#fff',
					'font-500': '#f1f1f1',
					'font-400': '#666',
					'font-300': '#999',
					'font-200': '#333',
					'font-100': '#111',
				},
			},
		},
	},

	/*
	** Set up internationalization
	** Doc: https://nuxtjs.org/examples/i18n
	*/
	i18n: {
		locales: [
			{ code: 'en', iso: 'en-US', file: 'en.js' },
		],
		langDir: 'i18n/',
		lazy: true,
		defaultLocale: 'en',
	},
};
