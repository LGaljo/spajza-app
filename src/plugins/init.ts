import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtPlugin(nuxtApp => {
  const authStore = useAuthStore()

  nuxtApp.hooks.hook('app:created', async () => {
    if (import.meta.client) {
      if (!authStore.user && authStore.token) {
        const userId = localStorage.getItem('userId')
        if (userId) {
          await authStore.fetchUser(userId)
        }
      }
    }
  })
})
