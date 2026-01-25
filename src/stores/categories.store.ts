import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { Category } from '~/lib/types'

export const useCategoriesStore = defineStore('categories', () => {
  const category = ref<Category | null>(null)
  const list = ref<Category[]>([])
  const error = ref<unknown | null>(null)
  const loading = ref(false)

  const runtimeConfig = useRuntimeConfig()
  const apiFetch = useApiFetch()

  const getList = computed(() => list.value)
  const getOne = computed(() => category.value)
  const getOptions = computed(() =>
    (list.value ?? []).map((c) => ({
      text: c.name,
      value: c._id,
    })),
  )

  const fetchOne = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<Category>(`${runtimeConfig.public.apiUrl}/categories/${id}`)
      category.value = res
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      toast.error('Napaka pri pridobivanju kategorije')
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetch = async (filters?: Record<string, unknown>) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<Category[]>(`${runtimeConfig.public.apiUrl}/categories`, {
        query: {
          ...(filters ?? {}),
        },
      })
      list.value = res
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      toast.error('Napaka pri pridobivanju kategorij')
      throw err
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<Category>(`${runtimeConfig.public.apiUrl}/categories/${id}`, {
        method: 'DELETE',
      })
      toast.success('Kategorija izbrisana')
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      toast.error('Napaka pri brisanju')
      throw err
    } finally {
      loading.value = false
    }
  }

  const unset = () => {
    list.value = null
  }

  return {
    category,
    list,
    error,
    loading,
    getList,
    getOne,
    getOptions,
    fetchOne,
    fetch,
    remove,
    unset,
  }
})
