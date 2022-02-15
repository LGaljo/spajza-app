export const state = () => ({
  tags: [],
})

export const mutations = {
  set(state, value) {
    state.tags = value
  },
  unset(state) {
    state.tags = null
  },
}

export const getters = {
  get(state) {
    return state.tags
  },
}

export const actions = {
  async fetch({ commit }) {
    this.$axios.$get(`/tags`)
      .then(res => {
        commit('set', res)
      })
      .catch(res => {
        console.error(res)
      })
  },
  unset({ commit }) {
    commit('unset')
  },
}
