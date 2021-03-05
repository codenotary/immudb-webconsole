<template>
	<div />
</template>

<script>
import { title } from '~/helpers/meta';

export default {
	middleware({ redirect }) {
		return redirect('/');
	},
	mounted () {
		// track google analytics pageview
		this.$gtag.pageview({
			page_title: '404 page',
			page_location: window && window.location && window.location.href,
			page_path: '/*',
		});
	},
	head() {
		return {
			title: title('Not found'),
		};
	},
};
</script>
