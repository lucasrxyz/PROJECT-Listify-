// src/plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Import du CSS des icônes
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#8E24AA',
          secondary: '#03DAC6',
          error: '#CF6679',
          niceColor: '#ff79ffff',
        },
      },
    },
  },
  defaults: {
    global: {
      style: {
        fontFamily: 'Arial, sans-serif', // Police globale
      },
    },
  },
})
