import { toast } from 'vue3-toastify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: "https://fonts.googleapis.com" },
        { rel: 'preconnect', href: "https://fonts.gstatic.com" },
        { rel: 'stylesheet', href: "https://fonts.googleapis.com/css2?family=Atma:wght@300;400;500;600;700&display=swap" },
      ]
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  srcDir: 'src/',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'nuxt-toastify',
    '@vee-validate/nuxt',
  ],
  plugins: [
    '~/plugins/api-fetch',
    '~/plugins/init',
  ],
  colorMode: {
    preference: 'system', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
  tailwindcss: { exposeConfig: true },
  css: ['@/styles.css'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL ?? 'http://localhost:4500',
    }
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  toastify: {
    autoClose: 2000,
    position: toast.POSITION.TOP_CENTER,
    theme: toast.THEME.DARK,
  },
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
})
