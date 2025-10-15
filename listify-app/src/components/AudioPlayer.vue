<template>
  <v-footer app padless height="100" color="#121212">
    <v-container fluid class="pa-0 d-flex flex-column align-center justify-center">

      <!-- Zone boutons + titre -->
      <div class="d-flex align-center justify-space-between w-100 px-6 mb-2" style="height: 70px;">
        <!-- Zone gauche : titre + artiste -->
        <v-card variant="text" width="400" class="d-flex rounded-lg flex-column justify-center pa-1" style="width: 320px; background-color: transparent;">
          <v-card-title  class="text-subtitle-1 ml-2 pa-0">
            <v-icon class="text-subtitle-1 mb-1 mr-1" color="niceColor">mdi-headphones</v-icon>{{ currentSong ? currentSong.title : 'No song played' }}
          </v-card-title>
          <v-card-subtitle class="text-caption ml-2 pa-0">
            {{ currentSong ? currentSong.artist : '' }}
          </v-card-subtitle>
        </v-card>

        <!-- Zone centrale : boutons -->
        <div class="d-flex align-center justify-center">
          <v-btn size="large" class="rounded-lg ma-1 ml-6" @click="prevSong" variant="text" density="compact" icon="mdi-shuffle"></v-btn>

          <v-btn size="large" class="rounded-lg ma-1 ml-6" @click="prevSong" variant="text" density="compact" icon="mdi-skip-previous"></v-btn>
          <v-btn size="large" class="rounded-lg ma-1" @click="rewindSeconds(15)" variant="text" density="compact" icon="mdi-rewind"></v-btn>
          <v-btn size="large" class="rounded-lg ma-1" @click="togglePlay" variant="tonal" density="compact" :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"></v-btn>
          <v-btn size="large" class="rounded-lg ma-1 rotate-180 test" @click="addSeconds(15)" variant="text" density="compact" icon="mdi-rewind"></v-btn>
          <v-btn size="large" class="rounded-lg ma-1 mr-6" @click="nextSong" variant="text" density="compact" icon="mdi-skip-next"></v-btn>

          <v-btn
            size="large"
            class="rounded-lg ma-1 mr-6"
            @click="toggleRepeat"
            variant="plain"
            density="compact"
            :icon="repeatIcon"
            :ripple="false"
          ></v-btn>

          <v-card variant="tonal" width="190" height="43" loading class="d-flex flex-column rounded-lg" style="padding-top:2px;">
            <v-card-title class="text-subtitle-2 ml-2 pa-0">
              <b>Next</b><v-icon class="text-subtitle-1 mb-1 mr-1">mdi-play</v-icon>{{ nextSong.title || 'Cool song' }}
            </v-card-title>
            <v-card-subtitle class="text-caption ml-2 pa-0">
              {{ nextSong.artist || 'Cool artist' }}
            </v-card-subtitle>
          </v-card>
        </div>

        <!-- Zone droite : contrôle du volume -->
        <div class="d-flex align-center ml-10" style="width: 200px;">
          <v-icon size="24" class="mr-2">
            {{ volumeIcon }}
          </v-icon>
          <v-slider
            v-model="volume"
            min="0"
            max="100"
            step="1"
            class="volume-slider"
            color="niceColor"
            hide-details
            thumb-size="0"
            track-size="3"
            thumb-label="off"
            style="width: 150px;"
          ></v-slider>
        </div>
      </div>

      <!-- Barre de progression -->
      <v-progress-linear
        :model-value="progressPercent"
        height="4"
        color="niceColor"
        rounded
        class="w-100"
      ></v-progress-linear>

      <!-- hidden YT player placeholder -->
      <div id="yt-player-container" style="display:none;">
        <div id="yt-player"></div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const currentSong = computed(() => store.getters.currentSong)
const isPlaying = computed(() => store.state.player.isPlaying)
const repeatMode = computed(() => store.state.player.repeatMode)

const progressPercent = ref(0)
const volume = ref(parseInt(localStorage.getItem('player_volume')) || 80) // volume par défaut à 80
let progressTimer = null
let ytPlayer = null
let ytApiReady = false
let playerReady = false
let skipInProgress = false

watch(currentSong, (newSong, oldSong) => {
  if (!newSong || !playerReady) return
  console.log('🎵 Loading new song:', newSong.title)
  loadVideoById(newSong.youtubeId, true)
})
watch(isPlaying, (val) => {
  if (!ytPlayer || !playerReady) return
  if (val) ytPlayer.playVideo()
  else ytPlayer.pauseVideo()
})

// --- Icônes repeat ---
const repeatIcon = computed(() => {
  switch (repeatMode.value) {
    case 1: return 'mdi-repeat'
    case 2: return 'mdi-repeat-once'
    default: return 'mdi-repeat-off'
  }
})

// --- Icône volume dynamique ---
const volumeIcon = computed(() => {
  if (volume.value === 0) return 'mdi-volume-mute'
  if (volume.value < 50) return 'mdi-volume-medium'
  return 'mdi-volume-high'
})

// --- Load YouTube API ---
function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      ytApiReady = true
      resolve()
      return
    }

    if (document.getElementById('youtube-iframe-api')) {
      const check = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(check)
          ytApiReady = true
          resolve()
        }
      }, 200)
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.id = 'youtube-iframe-api'
    document.head.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => {
      ytApiReady = true
      resolve()
    }
  })
}

// --- Create hidden YT player ---
function createPlayer() {
  if (!ytApiReady) return
  ytPlayer = new window.YT.Player('yt-player', {
    height: '0',
    width: '0',
    playerVars: { autoplay: 0, controls: 0, disablekb: 1, rel: 0, modestbranding: 1, playsinline: 1 },
    events: {
      onReady: () => {
        playerReady = true
        ytPlayer.setVolume(volume.value)
      },
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  })
}

// --- Player state ---
function onPlayerStateChange(event) {
  const state = event.data

  switch (state) {
    case window.YT.PlayerState.ENDED:
      store.dispatch('next')
      break
    case window.YT.PlayerState.PLAYING:
      store.commit('PLAYER_SET_PLAYING', true)
      startProgressTimer()
      break
    case window.YT.PlayerState.PAUSED:
      // ⚠️ Ignore les pauses pendant un skip
      if (skipInProgress) return
      store.commit('PLAYER_SET_PLAYING', false)
      stopProgressTimer()
      break
  }
}

function onPlayerError(event) {
  if (event.data === 2) return
  console.warn('YT player error', event)
}

function loadVideoById(youtubeId, autoplay = true) {
  if (!ytPlayer || !playerReady || !youtubeId) return
  try {
    ytPlayer.loadVideoById(youtubeId)
    if (autoplay) ytPlayer.playVideo()
    ytPlayer.setVolume(volume.value)
  } catch (e) {
    console.error('YT load error', e)
  }
}

// --- Volume watcher ---
watch(volume, (val) => {
  if (ytPlayer && playerReady) ytPlayer.setVolume(val)
  localStorage.setItem('player_volume', val)
})

// --- Lifecycle ---
onMounted(async () => {
  await loadYouTubeAPI()
  createPlayer()
})

onBeforeUnmount(() => {
  stopProgressTimer()
  if (ytPlayer && ytPlayer.destroy) ytPlayer.destroy()
})

// --- Progress timer ---
function startProgressTimer() {
  stopProgressTimer()
  progressTimer = setInterval(() => {
    if (!ytPlayer || typeof ytPlayer.getDuration !== 'function') return
    const duration = ytPlayer.getDuration()
    const current = ytPlayer.getCurrentTime()
    if (duration > 0) {
      progressPercent.value = Math.min((current / duration) * 100, 100)
    }
  }, 200)
}

function stopProgressTimer() {
  if (progressTimer) clearInterval(progressTimer)
}

// --- Controls ---
function togglePlay() { store.dispatch('togglePlay') }
function toggleRepeat() { store.dispatch('toggleRepeat') }
function nextSong() {
  skipInProgress = true
  store.dispatch('next')
  setTimeout(() => { skipInProgress = false }, 1000)
}

function prevSong() {
  skipInProgress = true
  store.dispatch('prev')
  setTimeout(() => { skipInProgress = false }, 1000)
}

</script>

<style scoped>
.test {
  transform: rotate(180deg) !important;
}
.volume-slider {
  --v-slider-track-size: 3px;
}
.couleur {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
