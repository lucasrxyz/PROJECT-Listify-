<template>
  <v-container fluid class="py-10 home-container">
    <!-- 🔹 En-tête -->
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 ml-5 mb-2">{{ greeting }}</h1><v-btn to="/playlists">Go to playlists</v-btn>
        <p>
          <span
            style="color:#61f73cff;"
            class="opacity-50 cursor-pointer ml-5"
            @click="href('/')"
            @mouseover="hoverHome = true"
            @mouseleave="hoverHome = false"
            :class="hoverHome ? 'text-decoration-underline' : ''"
          >
            Home
          </span>
        </p>
      </v-col>
    </v-row>

    <!-- 🔘 Boutons d’action -->
    <v-row class="px-5 mb-8">
      <v-col cols="12" class="d-flex flex-wrap align-center gap-3">
        <v-btn color="niceColor" variant="outlined" class="text-none mr-3 scale-105-rotate-btn" @click="playAllCombined">
          <v-icon class="mr-2" style="margin-bottom:2px;">mdi-play</v-icon>Play All
        </v-btn>
        <v-btn color="secondary" variant="outlined" class="text-none mr-3 scale-105-rotate-btn" @click="shuffleAll">
          <v-icon class="mr-2" style="margin-bottom:2px;">mdi-shuffle</v-icon>Shuffle all
        </v-btn>
        <v-btn color="grey" variant="text" class="text-none mr-3 scale-105-rotate-btn">
          <v-icon class="mr-2" style="margin-bottom:2px;">mdi-folder-plus</v-icon>Import Local Files
        </v-btn>
      </v-col>
    </v-row>

    <!-- Recently Played (playlist) -->
    <v-row class="px-5 mt-2">
      <v-col cols="12">
        <div 
          class="d-flex align-center justify-space-between mb-4 pb-2" 
          style="border-bottom:1px solid rgba(255,255,255,0.1)"
        >
          <h2 class="text-h5 mb-0">
            Recently Played
            <v-btn class="ml-3 mb-1" variant="outlined" @click="playAll">
              <b><v-icon class="mr-3" style="margin-bottom:2px;">mdi-play</v-icon>Play all</b>
            </v-btn>
          </h2>
          
          <v-btn variant="text" 
          class="opacity-50 text-white cursor-pointer text-subtitle-2 float-right" 
          @click="$router.push('/recently-played')">Show all</v-btn>
        </div>
      </v-col>

      <v-col cols="12">
        <v-list
          two-line
          class="rounded-lg scroll-hidden"
          style="max-height: 500px; overflow-y: auto;"
        >
          <v-list-item
            v-for="(song, idx) in recentSongs"
            :key="song.id || idx"
            class="rounded-0 hover:bg-grey-darken-3 transition-all mb-2 mr-2 ml-2"
            @click="selectSong(idx)"
          >
            <template #prepend>
              <div class="d-flex align-center">
                <v-btn
                  icon
                  @click.stop="playSong(idx)"
                  variant="plain"
                  class="elevation-0 rounded-0 mr-5"
                  density="comfortable"
                >
                  <v-icon>mdi-play</v-icon>
                </v-btn>

                <v-avatar size="56" rounded="lg" class="mr-3">
                  <v-img
                    :src="`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`"
                    alt="Song thumbnail"
                    cover
                  />
                </v-avatar>
              </div>
            </template>

            <v-list-item-content>
              <v-list-item-title class="font-medium d-flex align-center justify-space-between">
                <div>
                  <span class="mr-3">{{ song.title || 'Untitled' }}</span>
                  <span class="opacity-70 mr-4">{{ song.artist || 'Unknown artist' }}</span>
                  <span class="opacity-50">{{ song.duration || '0:00' }}</span>
                </div>

                <v-icon
                  class="cursor-pointer transition-all"
                  :color="isLiked(song) ? 'niceColor' : 'grey'"
                  :class="{ 'scale-115': hoveredHeart === song.id }"
                  @mouseenter="hoveredHeart = song.id"
                  @mouseleave="hoveredHeart = null"
                  @click.stop="toggleLike(song)"
                >
                  {{ isLiked(song)
                    ? 'mdi-heart'
                    : (hoveredHeart === song.id ? 'mdi-heart' : 'mdi-heart-outline') }}
                </v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-alert
          v-if="recentSongs.length === 0"
          type="info"
          color="niceColor"
          class="rounded-lg ma-4"
          density="compact"
          variant="text"
        >
          You haven't played any songs recently.
        </v-alert>
        </v-list>
        
      </v-col>
    </v-row>

    <!-- Recently Liked (playlist) -->
    <v-row class="px-5 mt-2">
      <v-col cols="12">
        <div 
          class="d-flex align-center justify-space-between mb-4 pb-2" 
          style="border-bottom:1px solid rgba(255,255,255,0.1)"
        >
          <h2 class="text-h5 mb-0">
            Recently Liked
            <v-btn class="ml-3 mb-1" variant="outlined" @click="playAllLiked">
              <b><v-icon class="mr-3" style="margin-bottom:2px;">mdi-play</v-icon>Play all</b>
            </v-btn>
          </h2>
          
          <v-btn variant="text" 
          class="opacity-50 text-white cursor-pointer text-subtitle-2 float-right" 
          @click="$router.push('/liked-songs')">Show all</v-btn>
        </div>
      </v-col>

      <v-col cols="12">
        <v-list
          two-line
          class="rounded-lg scroll-hidden"
          style="max-height: 500px; overflow-y: auto;"
        >
          <v-list-item
            v-for="(song, idx) in likedSongs"
            :key="song.id || idx"
            class="rounded-lg hover:bg-grey-darken-3 transition-all mb-2 mr-2 ml-2"
            @click="selectSong(idx)"
          >
            <template #prepend>
              <div class="d-flex align-center">
                <v-btn
                  icon
                  @click.stop="playSong(idx)"
                  variant="plain"
                  class="elevation-0 rounded-lg mr-5"
                  density="comfortable"
                >
                  <v-icon>mdi-play</v-icon>
                </v-btn>

                <v-avatar size="56" rounded="lg" class="mr-3">
                  <v-img
                    :src="`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`"
                    alt="Song thumbnail"
                    cover
                  />
                </v-avatar>
              </div>
            </template>

            <v-list-item-content>
              <v-list-item-title class="font-medium d-flex align-center justify-space-between">
                <div>
                  <span class="mr-3">{{ song.title || 'Untitled' }}</span>
                  <span class="opacity-70 mr-4">{{ song.artist || 'Unknown artist' }}</span>
                  <span class="opacity-50">{{ song.duration || '0:00' }}</span>
                </div>

                <v-icon
                  class="cursor-pointer transition-all"
                  :color="isLiked(song) ? 'niceColor' : 'grey'"
                  :class="{ 'scale-115': hoveredHeart === song.id }"
                  @mouseenter="hoveredHeart = song.id"
                  @mouseleave="hoveredHeart = null"
                  @click.stop="toggleLike(song)"
                >
                  {{ isLiked(song)
                    ? 'mdi-heart'
                    : (hoveredHeart === song.id ? 'mdi-heart' : 'mdi-heart-outline') }}
                </v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-alert
          v-if="recentSongs.length === 0"
          type="info"
          color="niceColor"
          class="rounded-lg ma-4"
          density="compact"
          variant="text"
        >
          You haven't liked any songs recently.
        </v-alert>
        </v-list>
        
      </v-col>
    </v-row>
    <!-- 🎤 Recent Artists -->
    <v-row class="px-5 mt-12">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Recent Artists</h2>
      </v-col>

      <v-col
        v-for="(artist, i) in recentArtists"
        :key="'artist-' + i"
        cols="6" sm="4" md="2"
        class="text-center"
      >
        <v-card elevation="0" class="rounded-xl pa-2">
          <v-avatar size="120" class="mx-auto mb-3">
            <v-img :src="artist.image" cover></v-img>
          </v-avatar>
          <p class="text-subtitle-2 text-white font-weight-medium mb-1">{{ artist.name }}</p>
          <v-btn
            variant="outlined"
            color="primary"
            size="small"
            class="mt-2 text-none"
            prepend-icon="mdi-account-music"
          >
            Open
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- 💾 Local Files -->
    <v-row class="px-5 mt-12 mb-10">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Local Files</h2>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card
          class="rounded-xl d-flex flex-column justify-center align-center pa-8 hover-elevate"
          color="#2a2a2a"
          elevation="2"
        >
          <v-icon size="56" color="white">mdi-folder-music</v-icon>
          <p class="text-white text-h6 mt-3 mb-1">Your Local Files</p>
          <p class="text-body-2 opacity-60 mb-3">Play songs from your device</p>
          <v-btn color="primary" variant="flat" class="text-none" prepend-icon="mdi-folder">Browse</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const greeting = ref('')

function updateGreeting() {
  const hour = new Date().getHours()
  console.log('Current hour:', hour)
  if (hour < 12) greeting.value = 'Good morning'
  else if (hour < 18) greeting.value = 'Good afternoon'
  else if (hour < 22) greeting.value = 'Good evening'
  else greeting.value = 'Good night'
}

// On exécute au chargement
updateGreeting()
setInterval(updateGreeting, 60 * 1000) // vérifie chaque minute
// ---------------------- //
// 🌟 Setup Vuex + data
// ---------------------- //
const store = useStore()

const hoverHome = ref(false)
const hoveredHeart = ref(null)

const hoverShowAll = ref(false)
// Simulation de playlist
const recentSongs = computed(() => store.state.recentlyPlayed.slice(0, 5))
const likedSongs = computed(() => store.state.likedSongs.slice(0, 5))

// Simulation d’artistes
const recentArtists = ref([
  { name: 'BLOVND', image: 'https://i.scdn.co/image/ab6761610000e5ebd7dc98f16f8e22f2e26c59c2' },
  { name: 'Lord Stingray', image: 'https://i.scdn.co/image/ab6761610000e5ebcf4dbf9a64c9d056646dd3a3' },
  { name: 'Alec.fbx', image: 'https://i.scdn.co/image/ab6761610000e5eb04d8a5632dbdf8a2dc7ad2cb' },
])

// ---------------------- //
// 🎵 Fonctions logiques
// ---------------------- //
function href(path) {
  window.location.href = path
}
function playAll() {
  const recent = store.state.recentlyPlayed
  if (!recent.length) return

  // On crée une playlist temporaire "recent" si besoin
  let recentPlaylist = store.state.playlists.find(p => p.id === 'recent')
  if (!recentPlaylist) {
    store.commit('ADD_PLAYLIST', { id: 'recent', name: 'Recently Played', songs: [] })
    recentPlaylist = store.state.playlists.find(p => p.id === 'recent')
  }

  // On synchronise les chansons récentes dans cette playlist
  recentPlaylist.songs = recent

  // On lance la lecture de la première chanson
  store.dispatch('playSong', { playlistId: 'recent', index: 0 })
}
function playAllLiked() {
  const liked = store.state.likedSongs
  if (!liked.length) return

  // On crée une playlist temporaire "liked" si besoin
  let likedPlaylist = store.state.playlists.find(p => p.id === 'liked')
  if (!likedPlaylist) {
    store.commit('ADD_PLAYLIST', { id: 'liked', name: 'Liked Songs', songs: [] })
    likedPlaylist = store.state.playlists.find(p => p.id === 'liked')
  }

  // On synchronise les chansons likées dans cette playlist
  likedPlaylist.songs = liked

  // On lance la lecture de la première chanson
  store.dispatch('playSong', { playlistId: 'liked', index: 0 })
}
function playAllCombined() {
  // Récupère toutes les chansons récentes + likées
  const allSongs = [...store.state.recentlyPlayed, ...store.state.likedSongs]
  if (!allSongs.length) return

  // Crée ou récupère une playlist temporaire "all"
  let allPlaylist = store.state.playlists.find(p => p.id === 'all')
  if (!allPlaylist) {
    store.commit('ADD_PLAYLIST', { id: 'all', name: 'All Recent & Liked', songs: [] })
    allPlaylist = store.state.playlists.find(p => p.id === 'all')
  }

  // On synchronise toutes les chansons dans cette playlist
  allPlaylist.songs = allSongs

  // On lance la lecture de la première chanson
  store.dispatch('playSong', { playlistId: 'all', index: 0 })
}
function shuffleAll() {
  // Combine les chansons récentes et likées
  const allSongs = [...store.state.recentlyPlayed, ...store.state.likedSongs]
  if (!allSongs.length) return

  // Fonction pour mélanger un tableau (Fisher-Yates)
  function shuffleArray(array) {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const shuffledSongs = shuffleArray(allSongs)

  // Crée ou récupère la playlist temporaire "allShuffled"
  let shuffledPlaylist = store.state.playlists.find(p => p.id === 'allShuffled')
  if (!shuffledPlaylist) {
    store.commit('ADD_PLAYLIST', { id: 'allShuffled', name: 'Shuffled Recent & Liked', songs: [] })
    shuffledPlaylist = store.state.playlists.find(p => p.id === 'allShuffled')
  }

  // On synchronise les chansons mélangées dans cette playlist
  shuffledPlaylist.songs = shuffledSongs

  // On lance la lecture de la première chanson
  store.dispatch('playSong', { playlistId: 'allShuffled', index: 0 })
}


function playSong(idx) {
  const song = recentSongs.value[idx]
  if (!song) return
  store.dispatch('playSongDirectly', song)
}
function removeSong(idx) {
  console.log('🗑️ Remove song index', idx)
}

function toggleLike(song) {
  store.dispatch('toggleLike', song)
}

function isLiked(song) {
  return store.state.likedSongs.some(s => s.youtubeId === song.youtubeId)
}

function selectSong(idx) {
  console.log('🎶 Selected song index', idx)
}
</script>

<style scoped>
.home-container {
  overflow-y: auto;
  max-height: calc(100vh - 80px);
}
.opacity-60 {
  opacity: 0.6;
}
/* 🌙 Cacher la barre de scroll mais garder le scroll actif */
::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* facultatif, pour Safari */
}

html, body {
  overflow-y: scroll; /* garde le scroll fonctionnel */
  scrollbar-width: none; /* pour Firefox */
}

body {
  -ms-overflow-style: none; /* pour Internet Explorer et Edge */
}
.scroll-hidden::-webkit-scrollbar {
  display: none;
}
.scroll-hidden {
  scrollbar-width: none; /* Firefox */
}

</style>
