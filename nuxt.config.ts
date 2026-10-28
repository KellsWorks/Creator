// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  modules: [
    '@nuxt/fonts',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@mdi/font/css/materialdesignicons.css', '~/assets/css/main.css'],
  build: {
    transpile: ['vuetify'],
  },
  fonts: {
    families: [
      { name: 'Raleway', provider: 'google', weights: [300, 400, 500, 600, 700] },
    ],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
