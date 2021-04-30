import Vue from 'vue';

// Create a global Event Bus
const EventBus = new Vue();

// Extend Vue component properties by exposing a getter for $eventbus
Object.defineProperties(Vue.prototype, {
	$eventbus: {
		get: () => EventBus,
	},
});
