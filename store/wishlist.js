export const state = () => ({
  items: [],
})

export const mutations = {
  set(state, value) {
    state.items = value
  },
  add(state, value) {
    state.items.push(value)
  },
  unset(state) {
    state.items = []
  },
}

export const getters = {
  get(state) {
    return state.items
  },
}

export const setter = {
  set(state, value) {
    state.items = value
  },
}

export const actions = {
  async fetch({ commit }) {
    return await this.$axios.$get(`/wishlist`)
      .then(res => {
        commit('set', res)
      })
      .catch(res => {
        console.error(res)
      })
  },
  async addItem({ commit, state }, item) {
    return await this.$axios.$post(`/wishlist`, { name: item, order: state.items.length + 1 })
      .then(res => {
        commit('add', res)
      })
      .catch(res => {
        console.error(res)
      })
  },
  unset({ commit }) {
    commit('unset')
  },
}
