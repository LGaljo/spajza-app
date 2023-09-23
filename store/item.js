export const state = () => ({
  list: [],
  item: null,
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
  // async fetchAll({ commit }){
  // },
  async fetch({ commit }, id) {
    return this.$axios.$get(`/inventory/${id}`)
      .then(res => {
        commit('set', res)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        this.$toast.error('Napaka pri pridobivanju podatkov', { duration: 3000 });
        return Promise.reject(err)
      })
  },
  async update({ commit }, id, data) {
    return this.$axios.$put(`/inventory/${id}`, data)
      .then(res => {
        commit('set', res)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        this.$toast.error('Napaka pri posodabljanju', { duration: 3000 });
        return Promise.reject(err)
      })
  },
  async remove({ commit }, id) {
    return this.$axios.$delete(`/inventory/${id}`)
      .then(res => {
        this.$toast.success(`Predmet "${this.item.name}" uspešno izbrisan`, { duration: 3000 });
        Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        this.$toast.error('Napaka pri brisanju', { duration: 3000 });
        return Promise.reject(err)
      })
  },
  async rent({ commit }, id) {
    return this.$axios.$post(`/rents/borrow/${this.item._id}`, this.form)
      .then((res) => {
        commit('set', res)
        this.$toast.success(`Predmet uspešno izposojen`, { duration: 3000 });
      })
      .catch(reason => {
        console.error(reason)
      })

  },
  async returnItem({ commit }, id) {
    return this.$axios.$post(`/rents/return/${this.item._id}`)
      .then(res => {
        commit('set', res)
        this.$toast.success(`Predmet "${this.item.name}" uspešno vrnjen`, { duration: 3000 });
        return Promise.resolve(res)
      })
      .catch((err) => {
        this.$toast.error(`Napaka pri brisanju predmeta`, { duration: 3000 });
        return Promise.reject(err)
      })
  },

  unset({ commit }) {
    commit('unset')
  },
}
