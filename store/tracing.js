export const state = () => ({
  traces: [],
})

export const mutations = {
  set(state, value) {
    state.traces = value
  },
  unset(state) {
    state.traces = null
  },
}

export const getters = {
  get(state) {
    return state.traces
  },
}

export const actions = {
  async fetch({ commit }, id) {
    return this.$axios.$get(`/tracing/${id}`)
      .then(res => {
        commit('set', res)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  unset({ commit }) {
    commit('unset')
  },
}
