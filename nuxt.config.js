import * as qs from 'qs';
import Sass from 'sass';
const SITE_NAME = 'immudb webconsole';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_PUBLIC_DEMO = process.env.PUBLIC_DEMO;
const EXPERIMENTAL = false && !IS_PROD;

console.log('=======================================');
console.log(`Running ${ IS_PUBLIC_DEMO
	? 'public demo'
	: 'local embedded' } client`);
console.log('=======================================');

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
	** Server propertySITE_NAME
	** See https://nuxtjs.org/api/configuration-server
	*/
	server: {
		host: '0.0.0.0',
		port: 8081,
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
		title: SITE_NAME,
		meta: [
			{ charset: 'utf-8' },
			{ name: 'HandheldFriendly', content: 'True' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		],
		link: [
			{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
			{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
			{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
			src: './assets/css/tooltip.scss',
			lang: 'scss',
			ssr: false,
		},
		{
			src: 'vue-json-pretty/lib/styles.css',
			lang: 'css',
			ssr: false,
		},
	],

	/*
	** Build configuration
	** See https://nuxtjs.org/api/configuration-build/
	*/
	build: {
		analyze: false,
		parallel: true,
		cache: EXPERIMENTAL,
		hardSource: EXPERIMENTAL,
		publicPath: '/nuxt_embedded/',
		extractCSS: IS_PROD,
		filenames: {
			app: IS_PROD ? '[chunkhash].js' : '[name].[hash].js',
			chunk: IS_PROD ? '[chunkhash].js' : '[name].[hash].js',
			css: IS_PROD ? '[name].[contenthash].css' : '[name].js',
		},
		// Extend webpack config
		extend(config, { isDev, isClient }) {
			// image-webpack-loader
			config.module.rules.forEach((rule) => {
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
									{ removeDimensions: true },
								],
							},
						},
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
			'vue-clipboards',
			'vue-cookies',
			'vue-json-pretty',
			'vue-prism-editor',
			'vue-toasted',
			'vue-worker',
			'vuex-persist',
		],
		optimization: {
			splitChunks: {
				chunks: 'async',
			},
		},
		babel: {
			plugins: [
				['@babel/plugin-proposal-private-methods', { loose: true }],
			],
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
		bundleRenderer: {
			shouldPrefetch: (_, type) => ['script', 'style', 'font'].includes(type) &&
				!_.includes('admin'),
			shouldPreload: (_, type) => ['script', 'style', 'font'].includes(type) &&
				!_.includes('admin'),
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
		{ src: '~/plugins/axios.js', srr: false },
		{ src: '~/plugins/event-bus.js', ssr: false },
		{ src: '~/plugins/global-mixins.js', ssr: false },
		{ src: '~/plugins/route.js', ssr: false },
		{ src: '~/plugins/vee-validate.js', ssr: false },
		{ src: '~/plugins/vue-clipboards.js', ssr: false },
		{ src: '~/plugins/vue-cookies.js', ssr: false },
		{ src: '~/plugins/vue-gtag.js', ssr: false },
		{ src: '~/plugins/vue-json-pretty.js', ssr: false },
		{ src: '~/plugins/vue-prism-editor.js', ssr: false },
		{ src: '~/plugins/vue-toasted.js', ssr: false },
		{ src: '~/plugins/vue-worker.js', ssr: false },
		{ src: '~/plugins/vuex-persist.js', ssr: false },
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
		// Doc: https://github.com/victor-perez/nuxt-helmet
		'nuxt-helmet',
		// Doc: https://axios.nuxtjs.org/setup
		'@nuxtjs/axios',
		// Doc: https://github.com/robcresswell/nuxt-compress
		['nuxt-compress',
			{
				gzip: {
					cache: true,
				},
				brotli: {
					threshold: 10240,
				},
			},
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
							fontStyle: 'normal',
						},
						// Font-Face
						{
							preload: false,
							src: 'typeface-roboto/files/roboto-latin-300',
							fontWeight: 300,
							fontStyle: 'normal',
						},
						// Font-Face
						{
							preload: true,
							src: 'typeface-roboto/files/roboto-latin-400',
							fontWeight: 400,
							fontStyle: 'normal',
						},
						// Font-Face
						{
							preload: true,
							src: 'typeface-roboto/files/roboto-latin-500',
							fontWeight: 500,
							fontStyle: 'normal',
						},
						// Font-Face
						{
							preload: true,
							src: 'typeface-roboto/files/roboto-latin-700',
							fontWeight: 700,
							fontStyle: 'normal',
						},
						// Font-Face
						{
							preload: false,
							src: 'typeface-roboto/files/roboto-latin-900',
							fontWeight: 900,
							fontStyle: 'normal',
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
		// Doc: https://github.com/geeogi/nuxt-responsive-loader
		'nuxt-responsive-loader',
		// Doc: https://github.com/potato4d/nuxt-client-init-module
		'nuxt-client-init-module',
		// Doc: https://github.com/f00b4r/nuxt-smartlook
		['nuxt-smartlook', {
			id: '62d7564b7fef3c36e74d0dc5ec76b8452043021e',
			enabled: IS_PROD,
		}],
	],

	/*
	** The env Property
	** https://nuxtjs.org/api/configuration-env/
	*/
	env: {
		IS_PROD,
		IS_PUBLIC_DEMO,
		VUE_APP_GIT_COMMIT_HASH: process.env.VUE_APP_GIT_COMMIT_HASH,
		WEBCONSOLE_VERSION: process.env.WEBCONSOLE_VERSION,
		DOCKER_API_URL: IS_PROD
			? '/'
			: process.env.DOCKER_API_URL || '/docker-api/',
		API_URL: process.env.API_URL || '/api',
		METRICS_API_URL: IS_PROD
			? '/'
			: process.env.METRICS_API_URL || '/metrics-api/',
		GITHUB_API_URL: 'https://api.github.com',
		GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || '',
	},

	/*
	** Development proxies
	** Doc: https://github.com/nuxt-community/proxy-module
	*/
	proxy: {
		// LOCAL ----------
		'/docker-api/': {
			target: 'http://localhost:8080',
			pathRewrite: { '^/docker-api/': '/' },
			xfwd: true,
			logLevel: 'debug',
		},
		'/api/': {
			target: 'http://localhost:8080',
			pathRewrite: { '^/api/': '/api/' },
			xfwd: true,
			logLevel: 'debug',
		},
		'/metrics-api/': {
			target: 'http://localhost:8080',
			pathRewrite: { '^/metrics-api/': '/' },
			xfwd: true,
			logLevel: 'debug',
		},
		// DEMO ----------
		'/demo/docker-api/': {
			target: process.env.DEMO_URL,
			pathRewrite: { '^/demo/docker-api/': '/' },
			xfwd: true,
			logLevel: 'debug',
		},
		'/demo/api/': {
			target: process.env.DEMO_URL,
			pathRewrite: { '^/demo/api/': '/api/' },
			xfwd: true,
			logLevel: 'debug',
		},
		'/demo/metrics-api/': {
			target: process.env.DEMO_URL,
			pathRewrite: { '^/demo/metrics-api/': '/' },
			xfwd: true,
			logLevel: 'debug',
		},
	},

	axios: {
		baseURL: process.env.API_URL || '/api',
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
				Pragma: 'no-cache',
				Accept: 'application/json',
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
		treeShake: true,
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
			dark: true,
			themes: {
				light: {
					primary: '#24c4a1',
					secondary: '#febf2d',
					accent: '#7c4dff',
					error: '#c06b6f',
					info: '#9fefde',
					success: '#7ec699',
					warning: '#f08d49',
					gray: '#616161',
					grey: '#616161',
					bg: '#fff',
					'bg-secondary': '#ebece9',
					'bg-tertiary': '#dfe6ed',
					'bg-terminal': '#768e98',
					'bg-code': '#768e98',
					'font-700': '#111',
					'font-500': '#333',
					'font-400': '#999',
					'font-300': '#666',
					'font-200': '#f1f1f1',
					'font-100': '#fff',
				},
				dark: {
					primary: '#24c4a1',
					secondary: '#febf2d',
					accent: '#7c4dff',
					error: '#c06b6f',
					info: '#9fefde',
					success: '#7ec699',
					warning: '#f08d49',
					gray: '#616161',
					grey: '#616161',
					bg: '#153954',
					'bg-secondary': '#0d3049',
					'bg-tertiary': '#45475b',
					'bg-terminal': '#1c273a',
					'bg-code': '#1c273a',
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
