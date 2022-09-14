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
  getOptions(state) {
    return state.categories.map((c) => {
      return {
        text: c.name,
        value: c._id,
      }
    })
  }
}

export const actions = {
  async fetch({ commit }, filters) {
    this.$axios.$get(`/categories`, {
      params: {
        filters
      }
    })
      .then(res => {
        commit('set', res)
        return res
      })
      .catch(res => {
        console.error(res)
      })
  },
  async remove({ commit }, id) {
    this.$axios.$delete(`/categories/${id}`)
      .then(res => {})
      .catch(res => {
        console.error(res)
      })
  },
  unset({ commit }) {
    commit('unset')
  },
}
