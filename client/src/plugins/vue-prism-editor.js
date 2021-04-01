import Vue from 'vue';
import PrismEditor from 'vue-prism-editor';
import 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/plugins/command-line/prism-command-line';
import '@/assets/css/prism.scss';

Vue.component('PrismEditor', PrismEditor);
