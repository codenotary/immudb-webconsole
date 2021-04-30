import Vue from 'vue';
import PrismEditor from 'vue-prism-editor';
import Prism from 'prismjs';

import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';
import '@/assets/css/prism.scss';

// Include additional languages
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-sql';

// Include the toolbar plugin: (optional)
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/toolbar/prism-toolbar.css';

// Include the line numbers plugin: (optional)
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

// Include the command line plugin: (optional)
import 'prismjs/plugins/command-line/prism-command-line';
import 'prismjs/plugins/command-line/prism-command-line.css';

// Include the line highlight plugin: (optional)
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';

// Include some other plugins: (optional)
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/plugins/highlight-keywords/prism-highlight-keywords';
import 'prismjs/plugins/show-language/prism-show-language';

Vue.component('PrismEditor', PrismEditor);

// Set vue SFC to markdown
Prism.languages.vue = Prism.languages.markup;

export default Prism;
