import { createFetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const apiFetch = createFetch({
    defaults: {
      baseURL: runtimeConfig.public.apiUrl || 'http://localhost:4500',
      onRequest: (request) => {
        if (import.meta.server) return
        const token = localStorage.getItem('jwt')
        if (!token) return

        if (!Object.keys(request.options?.headers).includes('Authorization')) {
          request.options?.headers.set('Authorization', `Bearer ${token}`)
        }
      },
      onResponseError: async ({ response }) => {
        if (!import.meta.client) return
        if (response && [401, 403].includes(response.status)) {
          const authStore = useAuthStore()
          await authStore.logout()
        }
      },
    },
  })

  return {
    provide: {
      apiFetch,
    },
  }
})
