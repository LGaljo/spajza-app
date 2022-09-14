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
  getOptions(state) {
    return state.tags.map((c) => {
      return {
        text: c.name,
        value: c._id,
      }
    })
  }
}

export const actions = {
  async fetch({ commit }, filters) {
    this.$axios.$get(`/tags`, { params: filters })
      .then(res => {
        commit('set', res)
      })
      .catch(res => {
        console.error(res)
      })
  },
  async remove({ commit }, id) {
    this.$axios.$delete(`/tags/${id}`)
      .then(res => {})
      .catch(res => {
        console.error(res)
      })
  },
  unset({ commit }) {
    commit('unset')
  },
}
