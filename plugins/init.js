import * as jwt from 'jsonwebtoken';

const unprotectedPaths = [
  '/login',
  '/registration',
  '/registration/complete',
  '/registration/verify',
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

export default function (context) {
  window.onNuxtReady(async () => {
    await checkAuth(context);
  })
}

export async function checkAuth(context) {
  if (
    !unprotectedPaths.find(path => decodeURI(context.route.path).startsWith(path))
  ) {
    if (localStorage.getItem('jwt')) {
      const decoded = jwt.decode(localStorage.getItem('jwt'), {complete: false})
      if (
        adminOnlyPaths.find(path => decodeURI(context.route.path).startsWith(path)) &&
        decoded.role !== 'ADMIN'
      ) {
        if (
          keeperOnlyPaths.find(path => decodeURI(context.route.path).startsWith(path)) &&
          decoded.role === 'KEEPER'
        ) {
          return;
        }
        await window.$nuxt.$router.push('/')
      }
    } else {
      await window.$nuxt.$router.push('/login')
    }
  }
}
