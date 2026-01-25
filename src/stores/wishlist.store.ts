import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  type WishlistItem = {
    _id?: string
    name: string
    order: number
  }

  const items = ref<WishlistItem[]>([])
  const error = ref<unknown | null>(null)
  const loading = ref(false)

  const apiFetch = useApiFetch()

  const fetch = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<WishlistItem[]>(`/wishlist`)
      items.value = res
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const addItem = async (item: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<WishlistItem>(`/wishlist`, {
        method: 'POST',
        body: {
          name: item,
          order: items.value.length + 1,
        },
      })
      items.value.push(res)
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
    items.value = []
  }

  return {
    items,
    error,
    loading,
    fetch,
    addItem,
    unset,
  }
})
