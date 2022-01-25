export default async function ({ app, store, route, redirect }) {

  if (process.server) {
    return;
  }

  const unprotectedPaths = [
    '/login',
    '/register'
  ]

  if (
    !unprotectedPaths.find(path => decodeURI(route.path).startsWith(path)) &&
    !localStorage.getItem('jwt')
  ) {
    redirect('/login')
  }

  if (
    unprotectedPaths.find(path => decodeURI(route.path).startsWith(path)) &&
    localStorage.getItem('jwt')
  ) {
    redirect('/')
  }
}
