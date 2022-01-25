export default function (context) {
  const unprotectedPaths = [
    '/login',
    '/register'
  ]

  window.onNuxtReady(async () => {
    if (
      !unprotectedPaths.find(path => decodeURI(context.route.path).startsWith(path)) &&
      !localStorage.getItem('jwt')
    ) {
      await window.$nuxt.$router.push('/login')
    }


    if (
      unprotectedPaths.find(path => decodeURI(context.route.path).startsWith(path)) &&
      localStorage.getItem('jwt')
    ) {
      await window.$nuxt.$router.push('/')
    }
  })
}
