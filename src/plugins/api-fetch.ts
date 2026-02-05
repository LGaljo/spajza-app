import { createFetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const apiFetch = createFetch({
    defaults: {
      baseURL: runtimeConfig.public.apiUrl || 'http://localhost:4500',
      onRequest: (request) => {
        const token = localStorage.getItem('jwt')
        if (!token) return

        if (!Object.keys(request.options?.headers).includes('Authorization')) {
          request.options?.headers.set('Authorization', `Bearer ${token}`)
        }
      }
    },
  })

  return {
    provide: {
      apiFetch,
    },
  }
})
