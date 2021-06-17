<template>
	<div />
</template>

<script>
export default {
	middleware({ redirect }) {
		return redirect('/');
	},
	head() {
		return {
			title: 'Not found - immudb webconsole',
		};
	},
	mounted () {
		// track google analytics pageview
		this.$gtag.pageview({
			page_title: '404',
			page_location: window && window.location && window.location.href,
			page_path: '/*',
		});
	},
};
</script>
