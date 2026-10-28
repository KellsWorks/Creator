import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const inputDefaults = { variant: 'outlined', density: 'comfortable', color: 'primary' }

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    defaults: {
      VTextField: inputDefaults,
      VTextarea: inputDefaults,
      VSelect: inputDefaults,
      VAutocomplete: inputDefaults,
    },
  })
  app.vueApp.use(vuetify)
})
