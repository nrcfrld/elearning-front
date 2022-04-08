import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import auth from './auth'
import appConfig from './app-config'
import masterdata from './masterdata'
import verticalMenu from './vertical-menu'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    auth,
    masterdata,
  },
  strict: process.env.NODE_ENV === 'development',
})
