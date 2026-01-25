import { createFetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const apiFetch = createFetch({
    defaults: {
      baseURL: runtimeConfig.public.apiUrl,
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
