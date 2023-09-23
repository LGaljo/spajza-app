export const state = () => ({
  list: [],
  item: null,
})

export const mutations = {
  set(state, value) {
    state.item = value
  },
  setList(state, value) {
    state.list = value
  },
  unset(state) {
    state.item = null
  },
  async addDefect(state, marker) {
    if (!state.item.hasOwnProperty('extras')) {
      state.item.extras = {defects: []};
    }
    state.item.extras.defects.push(marker);
  },
  async removeDefect(state, key) {
    const idx = state.item?.extras?.defects.findIndex((m) => m.key === key);
    state.item?.extras?.defects.splice(idx, 1);
  },
}

export const getters = {
  get(state) {
    return state.item
  },
  getList(state) {
    return state.list
  }
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
  async update({ commit }, data) {
    return this.$axios.$put(`/inventory/${data._id}`, data)
      .then(res => {
        commit('set', res)
        this.$toast.success(`Predmet uspešno posodobljen`, {duration: 2000});
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
        this.$toast.success(`Predmet uspešno izbrisan`, { duration: 3000 });
        Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        this.$toast.error('Napaka pri brisanju', { duration: 3000 });
        return Promise.reject(err)
      })
  },
  async rent({ commit }, id) {
    return this.$axios.$post(`/rents/borrow/${id}`, this.form)
      .then((res) => {
        commit('set', res)
        this.$toast.success(`Predmet uspešno izposojen`, { duration: 3000 });
      })
      .catch(reason => {
        console.error(reason)
      })

  },
  async returnItem({ commit }, id) {
    return this.$axios.$post(`/rents/return/${_id}`)
      .then(res => {
        commit('set', res)
        this.$toast.success(`Predmet uspešno vrnjen`, { duration: 3000 });
        return Promise.resolve(res)
      })
      .catch((err) => {
        this.$toast.error(`Napaka pri brisanju predmeta`, { duration: 3000 });
        return Promise.reject(err)
      })
  },
  async addDefect(context, marker) {
    context.commit('addDefect', marker)
    await context.dispatch('update', context.state.item)
  },
  async removeDefect(context, key) {
    context.commit('removeDefect', key)
    await context.dispatch('update', context.state.item)
  },
  unset({ commit }) {
    commit('unset')
  },
}
