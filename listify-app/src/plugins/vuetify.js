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
          accentLight: '#bfcfbfff',
          primary: '#61f73cff',
          secondary: 'rgba(71, 212, 35, 1)',
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
    VSlider: {
      ripple: false,
      rounded: 0,
    }
  },
})
