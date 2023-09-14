export const state = () => ({
  item: [],
})

export const mutations = {
  set(state, value) {
    state.item = value
  },
  unset(state) {
    state.item = null
  },
}

export const getters = {
  get(state) {
    return state.item
  },
}

export const actions = {
  async fetch({ commit }, id) {
    this.$axios.$get(`/inventory/${id}`)
      .then(res => {
        commit('set', res)
      })
      .catch(res => {
        console.error(res)
      })
  },
  async update({ commit }, id, data) {
    await this.$axios.$put(`/inventory/${id}`, data)
      .then(res => {
        commit('set', res)
      })
      .catch(res => {
        console.error(res)
      })
  },
  async remove({ commit }, id) {
    this.$axios.$delete(`/inventory/${id}`)
      .then(res => {})
      .catch(res => {
        console.error(res)
      })
  },
  unset({ commit }) {
    commit('unset')
  },
}
