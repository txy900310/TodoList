import Vue from 'vue'
import Vuex from 'vuex'
import base from '@/store/base'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    base: base
  }
})
