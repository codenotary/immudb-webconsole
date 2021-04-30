import Vue from 'vue';
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
	duration: 3000,
	iconPack: 'mdi',
	singleton: true,
});
