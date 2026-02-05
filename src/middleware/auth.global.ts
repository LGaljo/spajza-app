import { Role } from '~/lib/types'

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
  '/admin',
  '/users',
  '/tags',
  '/categories',
  '/import',
  '/edit',
  '/add',
  '/admin/import',
  '/admin/add',
]

const keeperOnlyPaths = [
  '/import',
  '/edit',
  '/add',
  '/admin/import',
  '/admin/add',
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

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const path = to.fullPath ?? to.path
  if (isPathMatch(path, unprotectedPaths)) return

  const token = localStorage.getItem('jwt')
  if (!token) {
    return navigateTo('/login')
  }

  const decoded = decodeJwtPayload(token)
  if (isPathMatch(path, adminOnlyPaths) && decoded?.role !== Role.ADMIN) {
    if (isPathMatch(path, keeperOnlyPaths) && decoded?.role === Role.KEEPER) {
      return
    }
    return navigateTo('/')
  }
})
