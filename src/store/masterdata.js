import useJwt from '@/auth/jwt/useJwt'

export default {
  namespaced: true,
  state: {
    roles: [],
  },
  mutations: {
    SET_ROLES(state, val) {
      state.roles = val
    },
  },
  actions: {
    async loadRoles({ commit, state }) {
      try {
        if (state.roles.length > 0) {
          return false
        }
        const response = await useJwt.axiosIns.get(
          `${process.env.VUE_APP_API_BASE_URL}/roles`
        )

        return commit('SET_ROLES', response.data.data)
      } catch (error) {
        return error
      }
    },
  },
}
