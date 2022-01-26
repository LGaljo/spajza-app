var jwt = require('jsonwebtoken');

const unprotectedPaths = [
  '/login',
  '/register'
]

const adminOnlyPaths = [
  '/users',
  '/tags',
  '/categories',
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
    !unprotectedPaths.find(path => decodeURI(context.route.path).startsWith(path)) &&
    !localStorage.getItem('jwt')
  ) {
    await window.$nuxt.$router.push('/login')
  }

  const decoded = jwt.decode(localStorage.getItem('jwt'), {complete: false})
  console.log(decoded)

  if (
    !unprotectedPaths.find(path => decodeURI(context.route.path).startsWith(path)) &&
    adminOnlyPaths.find(path => decodeURI(context.route.path).startsWith(path)) &&
    decoded.role !== 'ADMIN'
  ) {
    await window.$nuxt.$router.push('/')
  }
}
