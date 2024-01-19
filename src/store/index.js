import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import data from './modules/data'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    data,
  
  },
  actions: {

  },
  getters
})
