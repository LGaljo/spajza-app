import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Trace } from '~/lib/types'

export const useTracingStore = defineStore('tracing', () => {
  const traces = ref<Trace[]>([])
  const error = ref<unknown | null>(null)
  const loading = ref(false)

  const apiFetch = useApiFetch()

  const get = computed(() => traces.value)

  const fetch = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<Trace[]>(`/tracing/${id}`)
      traces.value = res
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const unset = () => {
    traces.value = []
  }

  return {
    traces,
    error,
    loading,
    get,
    fetch,
    unset,
  }
})
