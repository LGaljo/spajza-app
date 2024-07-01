export const state = () => ({
  list: [],
  filters: {
    category: {
      name: 'Kategorije',
      values: [],
      nameKey: 'name',
      valueKey: '_id',
      visible: false,
      type: 'multiple',
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
      values: [],
      nameKey: 'text',
      valueKey: 'value',
      visible: false,
      type: 'multiple'
    },
  },
  sort: {
    field: '_updatedAt',
    dir: 'desc',
    options: [
      { text: 'Ime predmeta', value: 'name' },
      { text: 'Čas zadnje posodobitve', value: '_updatedAt' },
      { text: 'Čas vnosa', value: '_createdAt' },
      { text: 'Identifikator', value: '_id' },
      { text: 'Vsebuje sliko', value: 'cover' },
    ]
  },
  search: null,
  sort_dir: null,
  selected: {
    category: [],
    tags: [],
    statuses: [],
  },
  skip: 0,
  limit: 15,
})

export const mutations = {
  set(state, value) {
    state.list = value
  },
  reset(state) {
    state.list = [];
    state.skip = 0;
  },
  resetFilters(state) {
    state.selected = {
      category: [],
      tags: [],
      statuses: [],
    }
  },
  append(state, value) {
    state.list.push(...value)
  },
  increment(state) {
    state.skip += state.limit
  },
  unset(state) {
    state.item = null
  },
  setFilterVisibility(state, {key, value}) {
    state.filters[key].visible = value
  },
  setFilterValues(state, {key, values}) {
    state.filters[key].values = values
  },
  setSortDir(state, dir) {
    state.sort.dir = dir
  },
  setSortField(state, field) {
    state.sort.field = field
  },
  setSelected(state, {field, value}) {
    state.selected[field] = value
  },
  setSearch(state, value) {
    state.search = value
  },
}

export const getters = {
  get(state) {
    return state.list
  },
  selected(state) {
    return state.selected
  },
  filters(state) {
    return state.filters
  },
  search(state) {
    return state.search
  },
  sort(state) {
    return state.sort
  }
}

export const actions = {
  async fetch(context) {
    return await this.$axios.$get(`/inventory`, { params: {
        category: context.state.selected.category,
        tags: context.state.selected.tags,
        statuses: context.state.selected.statuses,
        search: context.state.search,
        limit: context.state.limit,
        skip: context.state.skip,
        sort: context.state.sort.field,
        sort_dir: context.state.sort.dir
      } })
      .then(res => {
        context.dispatch('filtersToHistory')
        context.commit('append', res)
        context.commit('increment')
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        this.$toast.error('Napaka pri pridobivanju podatkov', { duration: 3000 });
        return Promise.reject(err)
      })
  },
  updateFilters(context, {field, value}) {
    if (field === 'search') {
      context.commit('setSearch', value)
    } else {
      context.commit('setSelected', {field, value})
    }
    context.commit('reset')
    context.dispatch('fetch')
  },
  onSortUpdate(context, value) {
    if (value?.dir) {
      context.commit('setSortDir', value?.dir)
    }
    if (value?.field) {
      context.commit('setSortField', value?.field)
    }
    context.commit('reset')
    context.dispatch('fetch')
  },
  toggleFilter(context, filter) {
    context.commit('setFilterVisibility', { key: filter, value: !context.state.filters[filter].visible })
  },
  setFilterValues(context, val) {
    context.commit('setFilterValues', val)
  },
  setFilters(context, object) {
    if (object?.category) {
      context.commit('setSelected', {field: 'category', value: object?.category.split(',') })
      context.commit('setFilterVisibility', { key: 'category', value: true })
    }
    if (object?.tags) {
      context.commit('setSelected', {field: 'tags', value: object?.category.split(',') })
      context.commit('setFilterVisibility', { key: 'tags', value: true })
    }
    if (object?.statuses) {
      context.commit('setSelected', {field: 'status', value: object?.category.split(',') })
      context.commit('setFilterVisibility', { key: 'statuses', value: true })
    }
    context.commit('setSortField', object?.name ?? '_updatedAt')
    context.commit('setSortDir', object?.dir ?? 'desc')
  },
  setSearch(context, value) {
    context.commit('setSearch', value)
  },
  resetList(context) {
    context.commit('reset')
  },
  resetFilters(context) {
    context.commit('resetFilters')
  },
  filtersToHistory(context) {
    const query = {};
    if (context.state.selected.category.length) query['category'] = context.state.selected.category
    if (context.state.selected.tags.length) query['tags'] = context.state.selected.tags
    if (context.state.selected.statuses.length) query['statuses'] = context.state.selected.statuses
    if (context.state.sort.field) query['sort'] = context.state.sort.field
    if (context.state.sort.field) query['dir'] = context.state.sort.dir

    const ret = [];
    for (let d in query) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(query[d]));
    }
    let encoded = '?' + ret.join('&')
    encoded = encoded.length > 1 ? encoded : '';
    history.pushState(
      {},
      null,
      `${encoded}`
    );
  }
}
