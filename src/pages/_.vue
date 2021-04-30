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
};
</script>
