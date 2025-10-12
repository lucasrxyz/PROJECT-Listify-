import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import PlayerView from '../pages/PlayerView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/player/:id', name: 'player', component: PlayerView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
