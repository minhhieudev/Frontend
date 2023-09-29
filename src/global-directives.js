import { directive } from 'vue-clickaway'
import store from './store'
import AppMixin from './mixins/app'
const GlobalDirectives = {
  install (Vue) {
    Vue.directive('click-outside', directive)
    Vue.directive('content', {
      inserted: (el) => {
        el.classList.add('page-content')
      }
    })
    Vue.prototype.$wrAlert = function (options) {
      store.dispatch('showAlert', options)
    }
    Vue.prototype.$wrLoading = function(status) {
      store.dispatch('toggleLoading', status)
    }
    Vue.mixin(AppMixin)
  }
}

export default GlobalDirectives
