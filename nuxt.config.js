const CONFIG = require(`./config/${process.env.NODE_ENV}`)

export default {
  server: {
    host: CONFIG.HOST || 'localhost',
    port: CONFIG.PORT || 3100
  },

  router: {
    middleware: [
      'auth'
    ]
  },

  loading: false,

  ssr: false,

  env: {
    TENT_ID: '61ed89c91ee6e6c74ee985d5',
    NO_IMAGE: 'https://spajza-bucket.s3.eu-central-1.amazonaws.com/item/nopicture.png',
    ...CONFIG
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Špajza',
    htmlAttrs: {
      lang: 'sl'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/app.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/init.js', ssr: false},
    '~/plugins/click-outside.js',
    '~/plugins/axios.js',
    '~/plugins/veevalidate.js',
    '~/plugins/bootstrap-icons.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
    '@nuxtjs/toast',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["vee-validate/dist/rules"],
    extend(config, ctx) {}
  },

  axios: {
    https: false,
    baseURL: CONFIG.API_URL
  },

  toast: {
    position: 'top-right',
  }

}
