import { defineNuxtPlugin, useRoute } from '#app'
import { useRouter } from '#vue-router'
import type { Router } from 'vue-router'
import { useAuthStore } from '~/stores/auth.store'

const unprotectedPaths = [
  '/login',
  '/registration',
  '/registration/complete',
  '/registration/verify',
  '/password/forgotten',
  '/password/change',
  '/forgotten-password',
  '/change-password',
]

const adminOnlyPaths = [
  '/users',
  '/tags',
  '/categories',
  '/import',
  '/edit',
  '/add'
]

const keeperOnlyPaths = [
  '/import',
  '/edit',
  '/add'
]

export default defineNuxtPlugin(nuxtApp => {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  nuxtApp.hooks.hook('app:created', async () => {
    if (import.meta.client) {
      await checkAuth(route, router);
      if (!authStore.user && authStore.token) {
        const userId = localStorage.getItem('userId')
        if (userId) {
          await authStore.fetchUser(userId)
        }
      }
    }
  })
})

type JwtPayload = {
  role?: string
}

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) return null
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export async function checkAuth(route: any, router: Router) {
  if (
    !unprotectedPaths.find(path => decodeURI(route.fullPath).startsWith(path))
  ) {
    if (localStorage.getItem('jwt')) {
      const token = localStorage.getItem('jwt')
      const decoded = token ? decodeJwtPayload(token) : null
      if (
        adminOnlyPaths.find(path => decodeURI(route.fullPath).startsWith(path)) &&
        decoded?.role !== 'ADMIN'
      ) {
        if (
          keeperOnlyPaths.find(path => decodeURI(route.fullPath).startsWith(path)) &&
          decoded?.role === 'KEEPER'
        ) {
          return;
        }
        await router.push('/')
      }
    } else {
      await router.push('/login')
    }
  } else {
  }
}
