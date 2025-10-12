<template>
  <v-footer app padless height="100" class="bg-grey-darken-3">
    <v-container class="d-flex align-center justify-space-between px-6 py-2" fluid>
      
      <!-- Info chanson -->
      <div class="d-flex align-center">
        <v-icon size="32" class="mr-2">mdi-music-note</v-icon>
        <div>
          <div class="text-subtitle-1 font-weight-medium">{{ currentSong.title }}</div>
          <div class="text-caption text-grey">{{ currentSong.artist }}</div>
        </div>
      </div>

      <!-- Contrôles -->
      <div class="d-flex align-center">
        <v-btn icon @click="prevSong"><v-icon>mdi-skip-previous</v-icon></v-btn>
        <v-btn icon @click="togglePlay">
          <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>
        <v-btn icon @click="nextSong"><v-icon>mdi-skip-next</v-icon></v-btn>
      </div>

      <!-- Progression -->
      <v-slider
        class="mx-4 w-50"
        v-model="progress"
        min="0"
        :max="duration"
        step="1"
        color="primary"
        @change="seekAudio"
      ></v-slider>

      <div class="text-caption">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
    </v-container>

    <!-- Audio caché -->
    <audio ref="audio" @timeupdate="updateProgress" @ended="nextSong"></audio>
  </v-footer>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const playlist = ref([
  { title: 'Chill Vibes', artist: 'LoFi Beats', videoId: '5qap5aO4i9A' },
  { title: 'Night Drive', artist: 'Synthwave Kid', videoId: 'DWcJFNfaw9c' },
  { title: 'Morning Coffee', artist: 'LoFi Chill', videoId: '7NOSDKb0HlU' }
])

const currentIndex = ref(0)
const currentSong = ref(playlist.value[currentIndex.value])
const audio = ref(null)
const isPlaying = ref(false)
const progress = ref(0)
const duration = ref(0)
const currentTime = ref(0)

onMounted(() => {
  audio.value.src = `https://www.youtube.com/embed/${currentSong.value.videoId}?autoplay=1&controls=0&modestbranding=1&iv_load_policy=3&rel=0`
  audio.value.crossOrigin = "anonymous"
})

// Lecture / Pause
const togglePlay = () => {
  if (!isPlaying.value) {
    audio.value.play()
  } else {
    audio.value.pause()
  }
  isPlaying.value = !isPlaying.value
}

// Chanson suivante
const nextSong = () => {
  currentIndex.value = (currentIndex.value + 1) % playlist.value.length
  loadSong()
}

// Chanson précédente
const prevSong = () => {
  currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
  loadSong()
}

// Charger une chanson
const loadSong = () => {
  currentSong.value = playlist.value[currentIndex.value]
  audio.value.src = `https://www.youtube.com/embed/${currentSong.value.videoId}?autoplay=1&controls=0&modestbranding=1&iv_load_policy=3&rel=0`
  audio.value.play()
  isPlaying.value = true
}

// Progression
const updateProgress = () => {
  currentTime.value = audio.value.currentTime
  progress.value = currentTime.value
  duration.value = audio.value.duration
}

// Slider -> audio
const seekAudio = () => {
  audio.value.currentTime = progress.value
}

// Format hh:mm:ss
const formatTime = (sec) => {
  if (!sec) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
</script>

<style scoped>
.v-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
