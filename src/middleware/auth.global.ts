import { Role } from '~/lib/types'
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
  '/admin/users',
  '/admin/tags',
  '/admin/categories',
  '/admin/templates',
  '/admin/import',
  '/admin/add',
  '/edit',
]

const keeperOnlyPaths = [
  '/admin/tags',
  '/admin/categories',
  '/admin/templates',
  '/admin/import',
  '/admin/add',
  '/edit',
]

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

const isPathMatch = (path: string, list: string[]) =>
  list.some(entry => decodeURI(path).startsWith(entry))

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return

  const path = to.fullPath ?? to.path
  if (isPathMatch(path, unprotectedPaths)) return

  const authStore = useAuthStore()

  const token = localStorage.getItem('jwt')
  if (token) {
    if (!authStore.user) {
      const userId = localStorage.getItem('userId')
      if (userId) {
        try {
          await authStore.fetchUser(userId)
        } catch {
          authStore.unsetUser()
          return navigateTo('/login')
        }
      } else {
        authStore.unsetUser()
        return navigateTo('/login')
      }
    }
  } else {
    authStore.unsetUser()
    return navigateTo('/login')
  }

  const decoded = decodeJwtPayload(token)
  const role = authStore.user?.role ?? decoded?.role

  if (isPathMatch(path, adminOnlyPaths) && role !== Role.ADMIN) {
    if (isPathMatch(path, keeperOnlyPaths) && role === Role.KEEPER) {
      return
    }
    return navigateTo('/')
  }
})
