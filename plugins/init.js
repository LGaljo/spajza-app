import * as jwt from 'jsonwebtoken';

const unprotectedPaths = [
  '/login',
  '/registration',
  '/registration/complete',
  '/registration/verify',
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
  console.log(context.route)
  if (
    !unprotectedPaths.find(path => decodeURI(context.route.path).startsWith(path))
  ) {
    console.log('jwt required');
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
