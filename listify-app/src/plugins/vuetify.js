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
          secondary: '#d998ffff',
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
    VBtn: {
      ripple: false, // désactive l’effet ripple pour tous les boutons
    },
    VListItem: {
      ripple: false, // désactive l’effet ripple pour les items de liste
    },
  },
})
