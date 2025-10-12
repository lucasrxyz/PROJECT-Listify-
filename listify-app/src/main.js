import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'

// Import de Vuetify depuis ton fichier de config
import vuetify from './plugins/vuetify'

// Import des styles Vuetify
import 'vuetify/styles'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(vuetify)

app.mount('#app')
