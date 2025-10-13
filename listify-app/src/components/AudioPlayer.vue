<template>
  <v-footer app padless height="80" color="#121212">
    <v-container fluid class="pa-0 d-flex align-center">
      <!-- Zone gauche : titre + artiste -->
      <v-card flat color="transparent" class="d-flex flex-column justify-center mr-4" style="width: 260px; height: 100%;">
        <v-card-title class="text-subtitle-1 pa-0">
          {{ currentSong ? currentSong.title : 'No song played' }}
        </v-card-title>
        <v-card-subtitle class="text-caption pa-0">
          {{ currentSong ? currentSong.artist : '' }}
        </v-card-subtitle>
      </v-card>

      <!-- Zone centrale : boutons -->
      <div class="d-flex align-center justify-center mx-4" style="flex: 0 0 auto;">
        <v-btn size="large" class="rounded-lg ma-1" @click="prevSong" variant="text" density="compact" icon="mdi-skip-previous"></v-btn>
        <v-btn size="large" class="rounded-lg ma-1" @click="togglePlay" variant="tonal" density="compact" :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"></v-btn>
        <v-btn size="large" class="rounded-lg ma-1" @click="nextSong" variant="text" density="compact" icon="mdi-skip-next"></v-btn>
      </div>

      <!-- Zone droite : barre de progression -->
      <v-progress-linear
        :model-value="progressPercent"
        height="4"
        color="niceColor"
        rounded
        class="flex-grow-1"
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

const progressPercent = ref(0)
let progressTimer = null
let ytPlayer = null
let ytApiReady = false
let playerReady = false

const currentTime = ref(0)
const duration = ref(0)

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
    onReady: () => { playerReady = true },
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
      store.commit('PLAYER_SET_PLAYING', false)
      stopProgressTimer()
      break
    case window.YT.PlayerState.BUFFERING:
    case window.YT.PlayerState.UNSTARTED:
      // Toujours mettre à jour la barre si la vidéo est prête
      startProgressTimer()
      break
    case window.YT.PlayerState.CUED:
      // Vidéo préchargée
      progressPercent.value = 0
      break
    default:
      console.log('YT state change', state)
  }
}
// --- Player errors ---
function onPlayerError(event) {
  // ignore 2 = cued
  if (event.data === 2) return
  console.warn('YT player error', event)
}
// --- Load a video safely ---
function loadVideoById(youtubeId, autoplay = true) {
  if (!ytPlayer || !playerReady || !youtubeId) return
  try {
    ytPlayer.loadVideoById(youtubeId)
    if (autoplay) ytPlayer.playVideo()
    
    // Force un check initial pour que la barre commence à bouger
    setTimeout(() => {
      const duration = ytPlayer.getDuration()
      if (duration > 0) startProgressTimer()
    }, 500)
  } catch (e) {
    console.error('YT load error', e)
  }
}

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
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}
let skipInProgress = false
// --- Watchers ---
watch(currentSong, async (song) => {
  stopProgressTimer()
  progressPercent.value = 0
  if (!song || !song.youtubeId) {
    if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo()
    return
  }

  skipInProgress = true  // <-- marque le skip en cours

  await loadYouTubeAPI()
  if (!ytPlayer) createPlayer()

  const waitForReady = () =>
    new Promise((resolve) => {
      const checkReady = setInterval(() => {
        if (playerReady) {
          clearInterval(checkReady)
          resolve()
        }
      }, 50)
    })
  await waitForReady()

  // Forcer autoplay
  loadVideoById(song.youtubeId, true)
  store.commit('PLAYER_SET_PLAYING', true)

  setTimeout(() => {
    skipInProgress = false  // <-- reset après que la vidéo soit lancée
  }, 500)
})

watch(isPlaying, (val) => {
  if (!ytPlayer || !playerReady) return
  if (skipInProgress) return  // <- ignore les changements pendant skip
  if (val) ytPlayer.playVideo()
  else ytPlayer.pauseVideo()
})

// --- Lifecycle ---
onMounted(async () => {
  await loadYouTubeAPI()
  createPlayer()
})

onBeforeUnmount(() => {
  stopProgressTimer()
  if (ytPlayer && ytPlayer.destroy) {
    ytPlayer.destroy()
    ytPlayer = null
  }
})

// --- Controls ---
function togglePlay() { store.dispatch('togglePlay') }
function nextSong() { store.dispatch('next') }
function prevSong() { store.dispatch('prev') }

</script>

