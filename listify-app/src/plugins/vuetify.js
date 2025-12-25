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
          background: '#010300ff',
          surface: '#010200ff',
          primary: '#61f73cff',
          secondary: '#47d423ff',
          error: '#b81818ff',
          niceColor: '#7fe466ff',
        },
      },
    },
  },
  defaults: {
    global: {
      style: {
        fontFamily: 'Calibri, sans-serif', // Police globale
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
