export const state = () => ({
  comments: [],
})

export const mutations = {
  set(state, value) {
    state.comments = value
  },
  unset(state) {
    state.comments = null
  },
}

export const getters = {
  get(state) {
    return state.comments
  }
}

export const actions = {
  async fetch({ commit }, filters) {
    this.$axios.$get(`/comments`, { params: { filters } })
      .then(res => {
        commit('set', res)
        return res
      })
      .catch(res => {
        console.error(res)
      })
  },
  async remove({ commit }, id) {
    this.$axios.$delete(`/comments/${id}`)
      .then(res => {})
      .catch(res => {
        console.error(res)
      })
  },
  async postComment({ commit }, data) {
    this.$axios.$post(`/comments`, data)
      .then(res => {
        commit('set', res)
        return res
      })
      .catch(res => {
        console.error(res)
      })
  },
  unset({ commit }) {
    commit('unset')
  },
}
