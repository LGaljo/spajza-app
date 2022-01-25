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
    // await checkRole(context);
  })
}

export async function checkAuth(context) {
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
}

export async function checkRole(context) {
  if (!unprotectedPaths.find(path => decodeURI(context.route.path).startsWith(path))) {
    let user = context.store.getters['user/getUser']
    if (!user) {
      user = await context.app.$axios.$get(`/user/${localStorage.getItem('userId')}`)
    }
    if (!user) {
      await window.$nuxt.$router.push('/login')
    } else {
      const isAdmin = user.role === 'ADMIN'
      if (
        adminOnlyPaths.find(path => decodeURI(context.route.path).startsWith(path)) &&
        !isAdmin
      ) {
        await window.$nuxt.$router.push('/')
      }
    }
  }
}
