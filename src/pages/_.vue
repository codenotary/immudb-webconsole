<template>
	<div />
</template>

<script>
export default {
	middleware({ redirect }) {
		return redirect('/');
	},
	mounted () {
		// track google analytics pageview
		process.env.IS_PUBLIC_DEMO && this.$gtag.pageview({
			page_title: '404',
			page_location: window && window.location && window.location.href,
			page_path: '/*',
		});
	},
	head() {
		return {
			title: 'Not found - immudb webconsole',
		};
	},
};
</script>
