import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { Tag } from '~/lib/types'

export const useTagsStore = defineStore('tags', () => {
  const list = ref<Tag[]>([])
  const error = ref<unknown | null>(null)
  const loading = ref(false)

  const runtimeConfig = useRuntimeConfig()
  const apiFetch = useApiFetch()

  const get = computed(() => list.value)
  const getOptions = computed(() =>
    (list.value ?? []).map((c) => ({
      text: c.name,
      value: c._id,
    })),
  )

  const fetch = async (filters?: Record<string, unknown>) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<Tag[]>(`${runtimeConfig.public.apiUrl}/tags`, {
        query: {
          ...(filters ?? {}),
        },
      })
      list.value = res
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      toast.error('Napaka pri pridobivanju značk')
      throw err
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<Tag>(`${runtimeConfig.public.apiUrl}/tags/${id}`, {
        method: 'DELETE',
      })
      toast.success('Značka izbrisana')
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
    list,
    error,
    loading,
    get,
    getOptions,
    fetch,
    remove,
    unset,
  }
})
