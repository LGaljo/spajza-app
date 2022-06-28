export const state = () => ({
  selected: {
    categories: null,
    tags: [],
    statuses: [],
  },
  filters: {
    categories: {
      name: 'Kategorije',
      values: [],
      nameKey: 'name',
      valueKey: '_id',
      visible: false,
      type: 'single',
    },
    tags: {
      name: 'Značke',
      values: [],
      nameKey: 'name',
      valueKey: '_id',
      visible: false,
      type: 'multiple'
    },
    statuses: {
      name: 'Status',
      values: [
        {
          text: "Novo",
          value: "NEW"
        },
        {
          text: "Izposojeno",
          value: "BORROWED"
        },
        {
          text: "Na voljo",
          value: "STORED"
        },
        {
          text: "Odpisano",
          value: "WRITTEN_OFF"
        },
      ],
      nameKey: 'text',
      valueKey: 'value',
      visible: false,
      type: 'multiple'
    },
  },
})

export const mutations = {
  set(state, { key, value }) {
    console.log(state.selected[key], value)
    state.selected[key] = value
  },
  set_categories(state, value) {
    state.filters.categories.values = value
  },
  set_tags(state, value) {
    state.filters.tags.values = value
  },
  set_visibility(state, value) {
    state.filters[value].visible = !state.filters[value].visible
  },
  unset(state) {
    state.selected.categories = null;
    state.selected.tags = [];
    state.selected.statuses = [];
  },
}

export const getters = {
  get_selected(state) {
    return state.selected
  },
  get_filters(state) {
    return state.filters
  },
  is_clear(state) {
    return !!((state.selected?.categories || state.selected?.tags?.length || state.selected?.statuses?.length))
  }
}

export const setter = {
  set(state, value) {
    state.selected = value
  },
}

export const actions = {
  fetch({ commit }) {
    this.$axios.$get(`/categories`)
      .then(res => {
        commit('set_categories', res)
      })
      .catch(res => {
        console.error(res)
      })
    this.$axios.$get(`/tags`)
      .then(res => {
        commit('set_tags', res)
      })
      .catch(res => {
        console.error(res)
      })
  },
  set({ commit, value }) {
    commit('set', value)
  },
  unset({ commit }) {
    commit('unset')
  },
}
