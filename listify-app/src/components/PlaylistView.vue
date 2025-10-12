<template>
  <v-container class="py-10">
    <v-btn variant="outlined" @click="$router.back()">← Retour</v-btn>
    <h1 class="text-h5 mt-6 mb-4">{{ playlist?.name }}</h1>

    <v-list>
      <v-list-item
        v-for="song in playlist?.songs"
        :key="song.id"
        @click="playSong(song.videoId)"
        class="hover:bg-grey-darken-3 rounded"
      >
        <v-list-item-title>{{ song.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <iframe
      v-if="currentVideoId"
      width="100%"
      height="400"
      :src="`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
    ></iframe>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const playlists = ref([])
const playlist = ref(null)
const currentVideoId = ref('')

onMounted(() => {
  const data = localStorage.getItem('playlists')
  playlists.value = data ? JSON.parse(data) : []
  playlist.value = playlists.value.find(p => p.id == route.params.id)
})

const playSong = (videoId) => {
  currentVideoId.value = videoId
}
</script>
