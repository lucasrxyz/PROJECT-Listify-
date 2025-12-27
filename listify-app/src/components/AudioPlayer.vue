<template>
  <v-footer app padless height="90" color="background" class="pb-3">
    <v-container fluid class="pa-0 d-flex flex-column align-center justify-center">

      <!-- Zone boutons + titre -->
      <div class="d-flex align-center justify-space-between w-100 px-6 mb-2" style="height: 70px;">
        <!-- Zone gauche : titre + artiste -->
        <v-card
          variant="text"
          class="d-flex align-center rounded-0 pa-2 transition-all box-shadow"
          :style="{
            width: '400px',
            backgroundColor: '#010200ff',
            opacity: currentSong ? 1 : 0,
            transition: 'opacity 0.4s ease'
          }">
          <div
            class="d-flex align-center"
            style="width: 48px; height: 48px; flex-shrink: 0; margin-right: 12px;"
          >
            <v-img
              v-if="currentThumbnail"
              :src="currentThumbnail"
              width="48"
              height="48"
              class="rounded-0"
              cover
            ></v-img>
          </div>
        
          <!-- Infos musique -->
          <div
            class="d-flex flex-column justify-center"
            style="overflow: hidden; min-width: 0;"
          >
            <v-card-title
              class="text-subtitle-1 pa-0 text-truncate"
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            >
              {{ currentSong ? currentSong.title : '' }}
            </v-card-title>
            <v-card-subtitle
              class="text-caption pa-0 text-truncate"
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            >
              {{ currentSong ? currentSong.artist : '' }}
            </v-card-subtitle>
          </div>
        </v-card>



        <!-- Zone centrale : boutons -->
        <div class="d-flex align-center justify-center">
          <v-btn size="large" class="rounded-0 ma-1 ml-6" @click="prevSong" variant="plain" density="compact" icon="mdi-shuffle"></v-btn>

          <v-btn size="large" class="rounded-0 ma-1 ml-6 " @click="prevSong" variant="plain" density="compact" icon="mdi-skip-previous"></v-btn>
          <!-- <v-btn size="large" class="rounded-0 ma-1" @click="rewindSeconds(15)" variant="text" density="compact" icon="mdi-rewind"></v-btn> -->

          <button class="frutiger-aero-button small mr-2 ml-2" @click="togglePlay">
            <v-icon color="surface" class="ma-0 pa-0">{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
          </button>
          <!-- <v-btn size="large" class="rounded-0 ma-1 rotate-180 test" @click="addSeconds(15)" variant="text" density="compact" icon="mdi-rewind"></v-btn> -->
           
          <v-btn size="large" class="rounded-0 ma-1 mr-6" @click="nextSong" variant="plain" density="compact" icon="mdi-skip-next"></v-btn>

          <v-btn
            size="large"
            class="rounded-0 ma-1 mr-6 hover-primary"
            @click="toggleRepeat"
            variant="plain"
            density="compact"
            :icon="repeatIcon"
            :ripple="false"
          ></v-btn>

          <v-card
            variant="text"
            width="190"
            height="45"
            class="d-flex flex-column rounded-0 transition-all position-relative"
            :style="{
              paddingTop: '2px',
              backgroundColor: '#070807ff',
              border: '1px solid rgba(71, 212, 35, 0.1)',
              opacity: showNextCard ? 1 : 0,
              transition: 'opacity 0.6s ease'
            }"
          >
            <v-card-title class="text-subtitle-2 ml-2 pa-0">
              <b>Next</b>
              <v-icon class="text-subtitle-1 mr-1" style="margin-bottom:2px;">mdi-play</v-icon>
              {{ nextSongPreview.title || '...' }}
            </v-card-title>
            <v-card-subtitle class="text-caption ml-2 pa-0">
              {{ nextSongPreview.artist || '' }}
            </v-card-subtitle>
          
            <!-- mini barre de progression interne -->
            <v-progress-linear
              :model-value="nextCardProgress"
              height="3"
              color="niceColor"
              class="position-absolute bottom-0 left-0 w-100"
            ></v-progress-linear>
          </v-card>
        </div>

        <!-- Zone droite : contrôle du volume -->
        <div class="d-flex align-center ml-10 rounded-0" style="width: 200px;">
          <v-icon size="18" class="mr-2 rounded-0">
            {{ volumeIcon }}
          </v-icon>
          <v-slider
            v-model="volume"
            min="0"
            max="100"
            step="1"
            color="niceColor"
            rounded-0
            class="rounded-0"
            hide-details
            thumb-size="0"
            track-size="1"
            style="width: 150px;"
          ></v-slider>
        </div>
      </div>

      <!-- Barre de progression -->
      <v-progress-linear
        :model-value="progressPercent"
        height="2"
        color="niceColor"
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
const currentThumbnail = computed(() => {
  if (!currentSong.value || !currentSong.value.youtubeId) return ''
  return `https://img.youtube.com/vi/${currentSong.value.youtubeId}/hqdefault.jpg`
})

const progressPercent = ref(0)
const volume = ref(parseInt(localStorage.getItem('player_volume')) || 80) // volume par défaut à 80
let progressTimer = null
let ytPlayer = null
let ytApiReady = false
let playerReady = false
let skipInProgress = false

const showNextCard = ref(false)
const nextCardLoading = ref(false)
const nextCardProgress = ref(0)
const nextSongPreview = ref({})

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
    showNextCard.value = false
    nextCardProgress.value = 0
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

      // 👇 Affiche la carte 8 secondes avant la fin
      const timeLeft = duration - current
      if (timeLeft <= 8) {
        if (!showNextCard.value) {
          showNextCard.value = true
          nextCardProgress.value = 0
          updateNextSongPreview()
        }
      
        // progression de 0 → 100% sur les 8 dernières secondes
        const progress = Math.min(((8 - timeLeft) / 8) * 100, 100)
        nextCardProgress.value = progress
      } else {
        nextCardProgress.value = 0
        showNextCard.value = false
      }
    }
  }, 200)
}

function stopProgressTimer() {
  if (progressTimer) clearInterval(progressTimer)
}
function updateNextSongPreview() {
  const playlistId = store.state.player.playlistId
  const playlist = store.state.playlists.find(p => p.id === playlistId)
  if (!playlist || !playlist.songs || playlist.songs.length === 0) {
    nextSongPreview.value = {}
    return
  }

  const currentIndex = store.state.player.songIndex || 0
  const nextIndex = (currentIndex + 1) % playlist.songs.length
  nextSongPreview.value = playlist.songs[nextIndex] || {}
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

.box-shadow {
  margin-left: -30px !important;
}



/* Authentic Frutiger Aero Button CSS */
.frutiger-aero-button {
  /* OKLCH Color System for accurate colors */
  --hue: 140;
  --sat: 0.28;
  --glow-intensity: 0.85;
  
  /* Color Variables */
  --fg: oklch(15% calc(var(--sat) * 0.5) var(--hue));
  --bg: oklch(75% var(--sat) var(--hue) / 0.8);
  --bg-dark: oklch(45% var(--sat) var(--hue) / 0.75);
  --bottom-glow: radial-gradient(
    farthest-corner at bottom center,
    rgba(255, 255, 255, var(--glow-intensity)),
    transparent
  );
  
  /* Base Styling */
  background-color: var(--bg);
  background: 
    var(--bottom-glow),
    linear-gradient(to bottom, var(--bg-dark), var(--bg));
  
  border: 1px solid var(--bg);
  border-radius: 9999px;
  
  /* Shadows and Effects */
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
  
  /* Typography */
  color: var(--fg);
  font-family: "Lucida Grande", "Lucida Sans Unicode", "Segoe UI", system-ui, sans-serif;
  font-weight: 700;
  text-shadow: 0 2px 0.5em rgba(0, 0, 0, 0.2);
  
  /* Layout */
  cursor: pointer;
  position: relative;
  transition: all 300ms ease;
  
  /* Prevent text selection */
  user-select: none;
  -webkit-user-select: none;
}

/* Top Highlight Effect */
.frutiger-aero-button::after {
  content: "";
  position: absolute;
  top: 4%;
  left: 0.75em;
  width: calc(100% - 1.5em);
  height: 40%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.1)
  );
  border-radius: inherit;
  transition: background 400ms ease;
  pointer-events: none;
}

/* Hover State */
.frutiger-aero-button:hover,
.frutiger-aero-button:focus {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
}

/* Active State */
.frutiger-aero-button:active {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transform: translateY(1px);
}

/* Size Variations */
.frutiger-aero-button.small {
  padding: 0.5em 0.7em;
  font-size: 0.875rem;
}

.frutiger-aero-button.medium {
  padding: 0.75em 2em;
  font-size: 1rem;
}

.frutiger-aero-button.large {
  padding: 1em 3em;
  font-size: 1.125rem;
}

.hover-primary {
  transition: 0.2s ease-in-out;
}
  .hover-primary:hover {
    color: #61f73cff;
  }
</style>
