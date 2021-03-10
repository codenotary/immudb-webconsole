import Vue from 'vue';
import VueWorker from 'vue-worker';
import { workers } from '../workers';

Vue.use(VueWorker);

Vue.prototype.$workers = workers && workers.methods;
