import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import ElementUI from 'element-ui'
import { isMobile } from 'mobile-device-detect';
import globalDirectives from './global-directives'
import './components/Widgets/index'
import './assets/scss/admin-dashboard.scss'
import './assets/css/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import 'tinymce'
import 'tinymce/themes/silver'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
// import 'tinymce/skins/content/default/content.css'
import 'tinymce/plugins/wordcount/plugin'
import 'tinymce/plugins/code/plugin'
import 'tinymce/plugins/link/plugin'
import './tinymce-plugins/image'
import 'tinymce/icons/default'
import './utils/vee-validate'
import VueQuillEditor from "vue-quill-editor";
import CKEditor from 'ckeditor4-vue';
Vue.use( CKEditor );
Vue.use(VueQuillEditor /* { default global options } */);
Vue.use(ElementUI, { locale })
Vue.use(globalDirectives)
Vue.config.productionTip = false

Vue.prototype.$isMobile = isMobile
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
