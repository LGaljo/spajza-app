import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { InventoryItem } from '~/lib/types'

export const useItemsStore = defineStore('items', () => {
  type FilterKey = 'category' | 'tags' | 'statuses'
  type FilterOption = {
    name: string
    values: string[]
    nameKey: string
    valueKey: string
    visible: boolean
    type: 'multiple'
  }
  type SelectedFilters = Record<FilterKey, string[]>
  type SortOption = { text: string; value: string }
  type SortState = { field: string; dir: string; options: SortOption[] }
  type SortUpdate = { dir?: string; field?: string }
  type FiltersQuery = Partial<Record<FilterKey, string>> & { name?: string; dir?: string }

  const list = ref<InventoryItem[]>([])
  const error = ref<unknown | null>(null)
  const loading = ref(false)
  const lastFetchCount = ref(0)

  const filters = reactive<Record<FilterKey, FilterOption>>({
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
      type: 'multiple',
    },
    statuses: {
      name: 'Status',
      values: [],
      nameKey: 'text',
      valueKey: 'value',
      visible: false,
      type: 'multiple',
    },
  })

  const sort = reactive<SortState>({
    field: '_updatedAt',
    dir: 'desc',
    options: [
      { text: 'Ime predmeta', value: 'name' },
      { text: 'Čas posodobitve', value: '_updatedAt' },
      { text: 'Čas vnosa', value: '_createdAt' },
      { text: 'Identifikator', value: '_id' },
      { text: 'Vsebuje sliko', value: 'cover' },
    ],
  })

  const search = ref<string | null>(null)
  const selected = reactive<SelectedFilters>({
    category: [],
    tags: [],
    statuses: [],
  })
  const skip = ref(0)
  const limit = ref(15)

  const runtimeConfig = useRuntimeConfig()
  const apiFetch = useApiFetch()

  const get = computed(() => list.value)
  const selectedFilters = computed(() => selected)
  const filterOptions = computed(() => filters)
  const currentSearch = computed(() => search.value)
  const currentSort = computed(() => sort)

  const reset = () => {
    list.value = []
    skip.value = 0
    lastFetchCount.value = 0
  }

  const resetFilters = () => {
    selected.category = []
    selected.tags = []
    selected.statuses = []
  }

  const append = (value: InventoryItem[]) => {
    list.value.push(...value)
  }

  const increment = () => {
    skip.value += limit.value
  }

  const setFilterVisibility = ({ key, value }: { key: FilterKey; value: boolean }) => {
    filters[key].visible = value
  }

  const setFilterValues = ({ key, values }: { key: FilterKey; values: string[] }) => {
    filters[key].values = values
  }

  const setSortDir = (dir: string) => {
    sort.dir = dir
  }

  const setSortField = (field: string) => {
    sort.field = field
  }

  const setSelected = ({ field, value }: { field: FilterKey; value: string[] }) => {
    selected[field] = value
  }

  const setSearch = (value: string | null) => {
    search.value = value
  }

  const fetch = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<InventoryItem[]>(`${runtimeConfig.public.apiUrl}/inventory`, {
        query: {
          category: selected.category,
          tags: selected.tags,
          statuses: selected.statuses,
          search: search.value,
          limit: limit.value,
          skip: skip.value,
          sort: sort.field,
          sort_dir: sort.dir,
        },
      })
      lastFetchCount.value = res.length
      filtersToHistory()
      append(res)
      increment()
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      toast.error('Napaka pri pridobivanju podatkov')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateFilters = ({ field, value }: { field: 'search' | FilterKey; value: string | string[] }) => {
    if (field === 'search') {
      setSearch(value as string)
    } else {
      setSelected({ field, value: value as string[] })
    }
    reset()
    return fetch()
  }

  const onSortUpdate = (value: SortUpdate) => {
    if (value?.dir) {
      setSortDir(value?.dir)
    }
    if (value?.field) {
      setSortField(value?.field)
    }
    reset()
    return fetch()
  }

  const toggleFilter = (filter: FilterKey) => {
    setFilterVisibility({
      key: filter,
      value: !filters[filter].visible,
    })
  }

  const setFilters = (object: FiltersQuery) => {
    if (object?.category) {
      setSelected({ field: 'category', value: object?.category.split(',') })
      setFilterVisibility({ key: 'category', value: true })
    }
    if (object?.tags) {
      setSelected({ field: 'tags', value: object?.tags.split(',') })
      setFilterVisibility({ key: 'tags', value: true })
    }
    if (object?.statuses) {
      setSelected({ field: 'statuses', value: object?.statuses.split(',') })
      setFilterVisibility({ key: 'statuses', value: true })
    }
    setSortField(object?.name ?? '_updatedAt')
    setSortDir(object?.dir ?? 'desc')
  }

  const resetList = () => {
    reset()
  }

  const filtersToHistory = () => {
    if (typeof window === 'undefined') return
    const query: Record<string, string | string[] | undefined> = {}
    if (selected.category.length) query.category = selected.category
    if (selected.tags.length) query.tags = selected.tags
    if (selected.statuses.length) query.statuses = selected.statuses
    if (sort.field) query.sort = sort.field
    if (sort.field) query.dir = sort.dir

    const ret = []
    for (const key in query) {
      const value = query[key]
      if (value === undefined) continue
      ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    }
    let encoded = `?${ret.join('&')}`
    encoded = encoded.length > 1 ? encoded : ''
    window.history.pushState({}, '', `${encoded}`)
  }

  return {
    list,
    error,
    loading,
    filters,
    sort,
    search,
    selected,
    skip,
    limit,
    lastFetchCount,
    get,
    selectedFilters,
    filterOptions,
    currentSearch,
    currentSort,
    reset,
    fetch,
    updateFilters,
    onSortUpdate,
    toggleFilter,
    setFilterValues,
    setFilters,
    setSearch,
    resetList,
    resetFilters,
  }
})
