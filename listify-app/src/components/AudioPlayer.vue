<template>
  <v-container class="d-flex align-center justify-space-between px-6 py-2" fluid>
    <div class="d-flex align-center">
      <v-icon size="32">mdi-music</v-icon>
      <div class="ml-3">
        <div class="text-subtitle-1 font-weight-medium">{{ currentSong.title }}</div>
        <div class="text-caption text-grey">{{ currentSong.artist }}</div>
      </div>
    </div>

    <div class="d-flex align-center">
      <v-btn icon @click="prev"><v-icon>mdi-skip-previous</v-icon></v-btn>
      <v-btn icon @click="togglePlay">
        <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
      </v-btn>
      <v-btn icon @click="next"><v-icon>mdi-skip-next</v-icon></v-btn>
    </div>

    <v-slider
      class="w-25"
      v-model="progress"
      min="0"
      max="100"
      step="1"
      color="primary"
    ></v-slider>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const isPlaying = ref(false)
const progress = ref(0)
const currentSong = ref({
  title: 'Chill Vibes',
  artist: 'Unknown Artist',
})

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

const next = () => {
  console.log('Next song')
}

const prev = () => {
  console.log('Previous song')
}
</script>
