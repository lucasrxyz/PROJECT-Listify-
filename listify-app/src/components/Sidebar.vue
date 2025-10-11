<template>
  <v-list dense nav>
    <v-list-item-title class="text-h6 mt-4 mb-2 text-center">
      🎧 Listify
    </v-list-item-title>

    <v-divider></v-divider>

    <v-list-item
      v-for="playlist in playlists"
      :key="playlist.id"
      :value="playlist.id"
      link
      class="hover:bg-grey-darken-3"
    >
      <v-list-item-title>{{ playlist.name }}</v-list-item-title>
    </v-list-item>

    <v-divider class="my-3"></v-divider>

    <v-btn
      block
      color="primary"
      prepend-icon="mdi-plus"
      @click="addPlaylist"
    >
      Nouvelle playlist
    </v-btn>
  </v-list>
</template>

<script setup>
import { ref } from 'vue'

const playlists = ref([
  { id: 1, name: 'Mes sons favoris' },
  { id: 2, name: 'Chill & Lo-Fi' },
  { id: 3, name: 'Workout' },
])

const addPlaylist = () => {
  const newId = playlists.value.length + 1
  playlists.value.push({ id: newId, name: `Playlist ${newId}` })
}
</script>

<style scoped>
.hover\:bg-grey-darken-3:hover {
  background-color: #2a2a2a;
}
</style>
