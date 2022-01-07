import { DEFAULT_META } from './index';

export const meta = meta => [
	{
		hid: 'description',
		name: 'description',
		content: (meta && meta.description) || DEFAULT_META.DESCRIPTION,
	},
	{
		hid: 'keywords',
		name: 'keywords',
		content: (meta && meta.keywords) || DEFAULT_META.KEYWORDS,
	},
	// Open Graph Data
	{
		hid: 'og:type',
		property: 'og:type',
		content: (meta && meta.type) || DEFAULT_META.TYPE,
	},
	{
		hid: 'og:url',
		property: 'og:url',
		content: (meta && meta.url) || DEFAULT_META.SITE_URL,
	},
	{
		hid: 'og:title',
		property: 'og:title',
		content: (meta && meta.title) || DEFAULT_META.TITLE,
	},
	{
		hid: 'og:description',
		property: 'og:description',
		content: (meta && meta.description) || DEFAULT_META.DESCRIPTION,
	},
	{
		hid: 'og:image',
		property: 'og:image',
		content: (meta && meta.mainImage) || DEFAULT_META.MAIN_IMAGE,
	},
	{
		property: 'og:image:width',
		content: '740',
	},
	{
		property: 'og:image:height',
		content: '300',
	},
	// Twitter Card
	{
		hid: 'twitter:url',
		name: 'twitter:url',
		content: (meta && meta.url) || DEFAULT_META.SITE_URL,
	},
	{
		hid: 'twitter:title',
		name: 'twitter:title',
		content: (meta && meta.title) || DEFAULT_META.TITLE,
	},
	{
		hid: 'twitter:description',
		name: 'twitter:description',
		content: (meta && meta.description) || DEFAULT_META.DESCRIPTION,
	},
	{
		hid: 'twitter:image',
		name: 'twitter:image',
		content: (meta && meta.mainImage) || DEFAULT_META.MAIN_IMAGE,
	},
];
