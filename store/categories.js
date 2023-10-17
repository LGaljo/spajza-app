export const state = () => ({
  category: null,
  list: [],
})

export const mutations = {
  setOne(state, value) {
    state.category = value
  },
  set(state, value) {
    state.list = value
  },
  unset(state) {
    state.list = null
  },
}

export const getters = {
  getList(state) {
    return state.list
  },
  getOne(state) {
    return state.category
  },
  getOptions(state) {
    return state.list.map((c) => {
      return {
        text: c.name,
        value: c._id,
      }
    })
  }
}

export const actions = {
  async fetchOne({ commit }, id) {
    return await this.$axios.$get(`/categories/${id}`)
      .then(res => {
        commit('setOne', res)
        return Promise.resolve(res)
      })
      .catch(res => {
        console.error(res)
        this.$toast.error('Napaka pri pridobivanju kategorije', { duration: 2500 })
        return Promise.reject(res)
      })
  },
  async fetch({ commit }, filters) {
    return await this.$axios.$get(`/categories`, {
      params: {
        ...filters
      }
    })
      .then(res => {
        commit('set', res)
        return Promise.resolve(res)
      })
      .catch(res => {
        console.error(res)
        this.$toast.error('Napaka pri pridobivanju kategorij', { duration: 2500 })
        return Promise.reject(res)
      })
  },
  async remove({ commit }, id) {
    return await this.$axios.$delete(`/categories/${id}`)
      .then(res => {
        this.$toast.success('Kategorija izbrisana', { duration: 2500 })
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
