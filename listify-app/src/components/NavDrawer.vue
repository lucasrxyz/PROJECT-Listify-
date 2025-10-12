<template>
  <v-navigation-drawer
    class="mr-2"
    app
    permanent
    width="250"
    color="#121212"
    dark
  >
    <!-- MENU PRINCIPAL -->
    <v-list class="py-4 ma-1">
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        prepend-icon="mdi-home-outline"
        title="Home"
        to="/"
        link
      />
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        prepend-icon="mdi-folder-outline"
        title="Playlists"
        to="/playlists"
        link
      />
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        prepend-icon="mdi-heart-outline"
        title="Liked Songs"
        to="/liked-songs"
        link
      />
    </v-list>

    <!-- LIBRARY -->
    <v-list density="compact">
      <v-list-title class="ml-3" style="opacity: 50%; font-size: 85%;">
        &nbsp;&nbsp;&nbsp;YOUR LIBRARY
      </v-list-title>

      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        title="Recently Played"
        to="/recently-played"
        link
      />
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        title="Local Files"
        to="/local-files"
        link
      />
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        title="Liked Artists"
        to="/liked-artists"
        link
      />
    </v-list>

    <!-- PLAYLISTS -->
    <v-list density="compact">
      <v-list-title class="ml-3" style="opacity: 50%; font-size: 85%;">
        &nbsp;&nbsp;&nbsp;PLAYLISTS
      </v-list-title>

      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        prepend-icon="mdi-plus"
        title="NEW PLAYLIST"
        @click="createPlaylist"
      />

      <!-- 🔽 Playlists dynamiques -->
      <v-list-item
        v-for="playlist in playlists"
        :key="playlist.id"
        :title="playlist.name"
        :to="`/player/${playlist.id}`"
        link
        class="mr-2 ml-2 mt-1 rounded-lg"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const playlists = ref([])

onMounted(() => {
  // On récupère les playlists stockées dans localStorage
  const stored = localStorage.getItem('playlists')
  if (stored) {
    playlists.value = JSON.parse(stored)
  }
})

// Optionnel : bouton pour créer une nouvelle playlist (placeholder)
const createPlaylist = () => {
  const name = prompt('Nom de la nouvelle playlist :')
  if (!name) return

  const newPlaylist = {
    id: Date.now(),
    name,
    songs: []
  }

  playlists.value.push(newPlaylist)
  localStorage.setItem('playlists', JSON.stringify(playlists.value))
}
</script>
