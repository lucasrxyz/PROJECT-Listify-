<template>
  <div>
    <h2 class="text-h5 mb-4">Playlist : {{ currentPlaylist.name }}</h2>

    <v-list>
      <v-list-item
        v-for="song in currentPlaylist.songs"
        :key="song.id"
        @click="play(song)"
        class="hover:bg-grey-darken-3 rounded"
      >
        <v-list-item-title>{{ song.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentPlaylist = ref({
  name: 'Mes sons favoris',
  songs: [
    { id: 1, title: 'Chill Vibes', artist: 'Unknown Artist' },
    { id: 2, title: 'Night Drive', artist: 'Synthwave Kid' },
    { id: 3, title: 'Morning Coffee', artist: 'LoFi Beats' },
  ],
})

const play = (song) => {
  console.log('Lecture de :', song.title)
  // TODO: envoyer vers le composant AudioPlayer
}
</script>
