export const state = () => ({
  items: [],
})

export const mutations = {
  set(state, value) {
    state.items = value;
  },
  append(state, value) {
    state.items.push(...value);
  },
}

export const getters = {
  get(state) {
    return state.items;
  },
}

export const setter = {
  set(state, value) {
    state.selected = value
  },
}

export const actions = {
}
