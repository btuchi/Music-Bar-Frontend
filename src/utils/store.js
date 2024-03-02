import Vue from 'vue'
import Vuex from 'vuex'
import cookie from './cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {
      username: cookie.getCookie('username') || '',
      token: cookie.getCookie('token') || '',
      userscope: cookie.getCookie('userscope') || '',
    },
    defaultOpeneds: []
  },
  mutations: {
    login(state, userInfo) {
      state.userInfo = userInfo
      cookie.setCookie('username', userInfo.username,  7 )
      cookie.setCookie('token', userInfo.token, 7 )
      cookie.setCookie('userscope', userInfo.userscope, 7 )
    },
    getInfo(state) {
      state.userInfo = {
        username: cookie.getCookie('username'),
        token: cookie.getCookie('token'),
        userscope: cookie.getCookie('userscope'),
      }
    },
    exit(state) {
      state.userInfo = {}
      cookie.delCookie('username')
      cookie.delCookie('token')
      cookie.delCookie('userscope')
    },
  },
  actions: {},
  modules: {},
})

export default store