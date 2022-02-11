export const state = () => ({
  categories: [],
})

export const mutations = {
  set(state, value) {
    state.categories = value
  },
  unset(state) {
    state.user = null
  },
}

export const getters = {
  get(state) {
    return state.categories
  },
}

export const actions = {
  async fetch({ commit }) {
    this.$axios.$get(`/categories`)
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
