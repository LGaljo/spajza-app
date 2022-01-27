export const state = () => ({
  token: null,
  user: null
})

export const mutations = {
  setToken(state, value) {
    state.token = value
  },
  setUser(state, value) {
    state.user = value
  },
  unsetUser(state, value) {
    state.user = null
  },
  unsetToken(state, value) {
    state.user = null
  },
}

export const getters = {
  getUser(state) {
    return state.user
  },
  isAdmin(state) {
    if (!state.user) return false;
    return state.user.role === 'ADMIN'
  },
  isKeeper(state) {
    if (!state.user) return false;
    return state.user.role === 'KEEPER'
  },
  isApproved(state) {
    if (!state.user) return false;
    return state.user.role !== 'UNAPPROVED'
  },
  isNormalUser(state) {
    if (!state.user) return false;
    return state.user.role === 'USER'
  }
}

export const actions = {
  async fetchUser({ commit }, userId) {
    await this.$axios.$get(`/users/${userId}`)
      .then(res => {
        commit('setUser', res)
      })
      .catch(res => {
        commit('set', null)
      })
  },
  unsetUser({ commit }) {
    commit('unsetUser')
    commit('unsetToken')
  },
}
