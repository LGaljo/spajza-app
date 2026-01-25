import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { InventoryItem } from '~/lib/types'

export const useItemStore = defineStore('item', () => {
  const item = ref<InventoryItem | null>(null)
  const error = ref<unknown | null>(null)
  const loading = ref(false)

  const runtimeConfig = useRuntimeConfig()
  const apiFetch = useApiFetch()

  const fetch = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<InventoryItem>(`${runtimeConfig.public.apiUrl}/inventory/${id}`)
      item.value = res
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

  const update = async (data: InventoryItem) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<InventoryItem>(`${runtimeConfig.public.apiUrl}/inventory/${data._id}`, {
        method: 'PUT',
        body: data,
      })
      item.value = res
      toast.success('Predmet uspešno posodobljen')
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      toast.error('Napaka pri posodabljanju')
      throw err
    } finally {
      loading.value = false
    }
  }

  const addImage = async (data: { file: File; id: string }) => {
    const formData = new FormData()
    formData.append('file', data.file)
    try {
      return await apiFetch<InventoryItem>(`${runtimeConfig.public.apiUrl}/inventory/file/${data.id}`, {
        method: 'POST',
        body: formData,
      })
    } catch (err) {
      console.error(err)
      toast.error('Napaka pri dodajanju slike')
      throw err
    }
  }

  const removeImage = async (data: { id: string; key: string }) => {
    try {
      return await apiFetch<InventoryItem>(`${runtimeConfig.public.apiUrl}/inventory/file/${data.id}`, {
        method: 'DELETE',
        query: { key: data.key },
      })
    } catch (err) {
      console.error(err)
      toast.error('Napaka pri brisanju slike')
      throw err
    }
  }

  const remove = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<InventoryItem>(`${runtimeConfig.public.apiUrl}/inventory/${id}`, {
        method: 'DELETE',
      })
      toast.success('Predmet uspešno izbrisan')
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

  const rent = async (id: string, form: { returnTime: string; renter: string; subject?: string | null }) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<InventoryItem>(`${runtimeConfig.public.apiUrl}/rents/borrow/${id}`, {
        method: 'POST',
        body: form,
      })
      item.value = res
      toast.success('Predmet uspešno izposojen')
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const returnItem = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<InventoryItem>(`${runtimeConfig.public.apiUrl}/rents/return/${id}`, {
        method: 'POST',
      })
      item.value = res
      toast.success('Predmet uspešno vrnjen')
      return res
    } catch (err) {
      console.error(err)
      error.value = err
      toast.error('Napaka pri brisanju predmeta')
      throw err
    } finally {
      loading.value = false
    }
  }

  type DefectMarker = NonNullable<InventoryItem['extras']>['defects'] extends Array<infer T> ? T : never

  const addDefect = async (marker: DefectMarker) => {
    if (!item.value) return
    if (!item.value.extras) {
      item.value.extras = { defects: [] }
    }
    if (!item.value.extras.defects) {
      item.value.extras.defects = []
    }
    item.value.extras.defects.push(marker)
    await update(item.value)
  }

  const removeDefect = async (key: string) => {
    if (item.value) {
      const idx = item.value?.extras?.defects?.findIndex((m) => m.key === key)
      if (idx === undefined || idx < 0) return
      item?.value?.extras?.defects?.splice(idx, 1)
      await update(item?.value)
    }
  }

  const unset = () => {
    item.value = null
  }

  return {
    item,
    error,
    loading,
    fetch,
    update,
    addImage,
    removeImage,
    remove,
    rent,
    returnItem,
    addDefect,
    removeDefect,
    unset,
  }
})
