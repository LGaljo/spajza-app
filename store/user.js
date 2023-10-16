export const state = () => ({
  token: null,
  user: null,
  loading: false,
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
    return await this.$axios.$get(`/users/${userId}`)
      .then(res => {
        commit('setUser', res)
      })
      .catch(res => {
        commit('setUser', null)
      })
  },
  async login({ commit }, data) {
    return await this.$axios.$post('/auth/login', data)
      .then(async res => {
        if (res?.success) {
          localStorage.setItem('jwt', res?.data?.access_token)
          localStorage.setItem('userId', res?.data?.user?._id)
          commit('setToken', res?.data?.userId)
          commit('setUser', res?.data?.user)
        } else if (!res?.success && res?.reason === 'UNAPPROVED') {
          return Promise.resolve({
            resend_act: res?.userId,
            error: "Uporabnik še ni aktiviran. Najdi email s povezavo.",
          })
        }
      })
      .catch(reason => {
        console.error(reason)
        this.$toast.error("Napaka pri prijavi", { duration: 3000 })
        return Promise.reject({
          resend_act: null,
          error: "Napačni prijavni podatki",
        })
      })
  },
  unsetUser({ commit }) {
    commit('unsetUser')
    commit('unsetToken')
  },
}
