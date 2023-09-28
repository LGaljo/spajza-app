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
    await this.$axios.$get(`/tags`, { params: filters })
      .then(res => {
        commit('set', res)
        return Promise.resolve(res)
      })
      .catch(res => {
        console.error(res)
        this.$toast.error('Napaka pri pridobivanju značk', { duration: 2500 })
        return Promise.reject(res)
      })
  },
  async remove({ commit }, id) {
    await this.$axios.$delete(`/tags/${id}`)
      .then(res => {
        this.$toast.success('Značka izbrisana', { duration: 2500 })
        return Promise.resolve(res)
      })
      .catch(res => {
        console.error(res)
        this.$toast.error('Napaka pri brisanju', { duration: 2500 })
        return Promise.reject(res)
      })
  },
  unset({ commit }) {
    commit('unset')
  },
}
