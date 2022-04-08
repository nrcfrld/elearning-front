export default {
  namespaced: true,
  state: {
    user: {},
    isLoggedIn: false,
  },
  getters: {
    isAdmin(state) {
      return state.user.role.name === 'admin'
    },
  },
  mutations: {
    SET_USER(state, val) {
      state.user = val
    },
  },
  actions: {
    setUser({ commit }, payload) {
      commit('SET_USER', payload)
    },
  },
}
