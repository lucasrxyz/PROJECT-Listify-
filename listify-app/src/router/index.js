import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import Playlists from '../pages/Playlists.vue'
import PlayerView from "../views/PlayerView.vue";

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/playlists', name: 'playlists', component: Playlists },
  { path: "/player/:id", name: "player", component: PlayerView },
  { path: "/liked-songs", name: "liked-songs", component: () => import("../pages/LikedSongs.vue") }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
