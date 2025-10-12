<template>
  <v-container fluid class="pa-4">
    <v-btn variant="outlined" @click="$router.back()">← Retour</v-btn>
    <h1 class="text-h5 mt-4 mb-4">{{ playlist?.name }}</h1>

    <!-- Liste des chansons avec miniatures -->
    <v-list>
      
      <v-list-item
        v-for="song in playlist?.songs"
        :key="song.id"
        @click="playSong(song.id)"
        class="hover:bg-grey-lighten-3 rounded d-flex align-center"
      >
        <v-row>
        <!-- Miniature carrée -->
        <v-img
          :src="`https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`"
          height="60"
          width="100"
          class="mr-4"
          style="border-radius: 0;"
        />

        <!-- Contenu titre + durée -->
        <v-list-item-content class="d-flex flex-column justify-center">
          <v-list-item-title>{{ song.title }}&nbsp;&nbsp;&nbsp;</v-list-item-title>
          <v-list-item-subtitle>
            {{ song.durationText || 'Durée inconnue' }}
          </v-list-item-subtitle>
        </v-list-item-content>
        </v-row>
      </v-list-item>
    </v-list>




    <!-- Ajouter une chanson -->
    <v-btn color="primary" class="mt-4" @click="dialog = true">
      Ajouter une chanson
    </v-btn>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Ajouter une chanson</v-card-title>
        <v-card-text>
          <v-text-field v-model="newSongUrl" label="Lien YouTube"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="addSong">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Player caché -->
    <div id="yt-player" style="display:none;"></div>

    <!-- Barre de lecture permanente -->
    <v-sheet
      height="100"
      color="grey lighten-3"
      class="d-flex align-center justify-space-between px-6 fixed-bottom"
    >
      <div class="d-flex align-center">
        <v-img
          v-if="currentSong"
          :src="`https://img.youtube.com/vi/${currentSong.videoId}/hqdefault.jpg`"
          max-width="60"
          class="mr-2 rounded"
        />
        <div>
          <div class="text-subtitle-1 font-weight-medium">{{ currentSong?.title }}</div>
          <div class="text-caption text-grey">{{ currentSong?.artist }}</div>
        </div>
      </div>

      <div class="d-flex align-center">
        <v-btn icon @click="prevSong"><v-icon>mdi-skip-previous</v-icon></v-btn>
        <v-btn icon @click="togglePlay">
          <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>
        <v-btn icon @click="nextSong"><v-icon>mdi-skip-next</v-icon></v-btn>
      </div>

      <v-slider
        class="mx-4 flex-grow-1"
        v-model="progress"
        :max="duration"
        step="1"
        color="primary"
        @change="seekVideo"
      ></v-slider>

      <div class="text-caption">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Playlist
const playlists = ref([])
const playlist = ref(null)
const currentSong = ref(null)
const currentIndex = ref(0)

// Dialogue ajout chanson
const dialog = ref(false)
const newSongUrl = ref('')

// Player YouTube
let player = null
let isPlayerReady = false
const isPlaying = ref(false)
const progress = ref(0)
const duration = ref(0)
const currentTime = ref(0)
let intervalId = null

// Charger playlist depuis localStorage
onMounted(() => {
  const data = localStorage.getItem('playlists')
  playlists.value = data ? JSON.parse(data) : []
  playlist.value = playlists.value.find(p => p.id == route.params.id)
  if (!playlist.value) playlist.value = { id: Date.now(), name: 'Playlist', songs: [] }
  if (playlist.value.songs.length > 0) {
    currentIndex.value = 0
    currentSong.value = playlist.value.songs[0]
  }

  loadYouTubeAPI()
})

// Ajouter chanson avec récupération du titre
const addSong = async () => {
  if (!newSongUrl.value) return

  const match = newSongUrl.value.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (!match) {
    alert('Lien YouTube invalide')
    return
  }
  const videoId = match[1]

  try {
    const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
    const data = await res.json()
    const title = data.title || 'Titre inconnu'

    // Créer un lecteur temporaire caché pour récupérer la durée
    const tempDiv = document.createElement('div')
    tempDiv.style.display = 'none'
    document.body.appendChild(tempDiv)
    const tempPlayer = new YT.Player(tempDiv, {
      videoId,
      events: {
        onReady: () => {
          const dur = tempPlayer.getDuration()
          const song = {
            id: Date.now(),
            title,
            artist: '',
            videoId,
            duration: dur,
            durationText: formatTime(dur)
          }

          playlist.value.songs.push(song)
          const index = playlists.value.findIndex(p => p.id === playlist.value.id)
          playlists.value[index] = playlist.value
          localStorage.setItem('playlists', JSON.stringify(playlists.value))

          tempPlayer.destroy()
          tempDiv.remove()

          newSongUrl.value = ''
          dialog.value = false

          // si c'est la première chanson
          if (!currentSong.value) {
            currentIndex.value = 0
            currentSong.value = song
            createPlayer()
          }
        }
      }
    })
  } catch (err) {
    console.error(err)
    alert('Impossible de récupérer le titre ou la durée')
  }
}


// YouTube IFrame API
const loadYouTubeAPI = () => {
  if (window.YT) {
    createPlayer()
    return
  }

  const tag = document.createElement('script')
  tag.src = "https://www.youtube.com/iframe_api"
  document.body.appendChild(tag)
  window.onYouTubeIframeAPIReady = createPlayer
}

const createPlayer = () => {
  if (!currentSong.value) return
  if (player) return

  player = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: currentSong.value.videoId,
    playerVars: { autoplay: 0, controls: 0, modestbranding: 1 },
    events: {
      onReady: () => {
        isPlayerReady = true
        duration.value = player.getDuration()
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) nextSong()
      }
    }
  })
}

// Lecture/Pause
const playVideo = () => {
  if (!player || !isPlayerReady) return
  player.playVideo()
  isPlaying.value = true
  intervalId = setInterval(() => {
    currentTime.value = player.getCurrentTime()
    progress.value = currentTime.value
    duration.value = player.getDuration()
  }, 500)
}

const pauseVideo = () => {
  if (!player) return
  player.pauseVideo()
  isPlaying.value = false
  clearInterval(intervalId)
}

const togglePlay = () => {
  if (!isPlaying.value) playVideo()
  else pauseVideo()
}

// Chanson suivante / précédente
const nextSong = () => {
  if (playlist.value.songs.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % playlist.value.songs.length
  currentSong.value = playlist.value.songs[currentIndex.value]
  if (player && isPlayerReady) {
    player.loadVideoById(currentSong.value.videoId)
    playVideo()
  }
}

const prevSong = () => {
  if (playlist.value.songs.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + playlist.value.songs.length) % playlist.value.songs.length
  currentSong.value = playlist.value.songs[currentIndex.value]
  if (player && isPlayerReady) {
    player.loadVideoById(currentSong.value.videoId)
    playVideo()
  }
}

// Slider -> seek
const seekVideo = () => {
  if (!player) return
  player.seekTo(progress.value, true)
}

// Format hh:mm
const formatTime = (sec) => {
  if (!sec) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Jouer une chanson depuis la liste
const playSong = async (id) => {
  const idx = playlist.value.songs.findIndex(s => s.id === id)
  if (idx < 0) return
  currentIndex.value = idx
  currentSong.value = playlist.value.songs[idx]

  if (!player) {
    createPlayer()
    await waitPlayerReady()
  } else if (!isPlayerReady) {
    await waitPlayerReady()
  }

  player.loadVideoById(currentSong.value.videoId)
  playVideo()
}

// Utilitaire pour attendre le player
const waitPlayerReady = () => {
  return new Promise(resolve => {
    const check = setInterval(() => {
      if (isPlayerReady) {
        clearInterval(check)
        resolve()
      }
    }, 50)
  })
}
</script>


<style scoped>
.fixed-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 10;
}
</style>
