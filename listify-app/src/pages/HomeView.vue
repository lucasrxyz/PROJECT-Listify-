<template>
  <v-container fluid class="py-10 home-container">
    <!-- 🔹 En-tête -->
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 ml-5 mb-2">Good morning</h1>
        <p>
          <span
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
        <v-btn color="niceColor" variant="outlined" prepend-icon="mdi-play" class="text-none mr-2">
          Play All
        </v-btn>
        <v-btn color="secondary" variant="text" prepend-icon="mdi-shuffle" class="text-none mr-2">
          Shuffle
        </v-btn>
        <v-btn color="secondary" variant="text" prepend-icon="mdi-heart-multiple-outline" class="text-none mr-2">
          Liked
        </v-btn>
        <v-btn color="grey" variant="plain" prepend-icon="mdi-folder-plus" class="text-none mr-2">
          Import Local Files
        </v-btn>
      </v-col>
    </v-row>

    <!-- 🌈 Recently Played (playlist) -->
    <v-row class="px-5 mt-2">
      <v-col cols="12">
        <div 
          class="d-flex align-center justify-space-between mb-4 pb-2" 
          style="border-bottom:1px solid rgba(255,255,255,0.1)"
        >
          <h2 class="text-h5 mb-0">Recently Played</h2>
          <span
            class="opacity-50 text-white cursor-pointer text-subtitle-2"
            @click="$router.push('/recently-played')"
            @mouseover="hoverShowAll = true"
            @mouseleave="hoverShowAll = false"
            :class="hoverShowAll ? 'text-decoration-underline' : ''"
          >
            Show all
          </span>
        </div>
      </v-col>

      <v-col cols="12">
        <v-list
          two-line
          class="rounded-lg scroll-hidden"
          style="max-height: 500px; overflow-y: auto;"
        >
          <v-list-item
            v-for="(song, idx) in selectedPlaylist?.songs || []"
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
                  class="elevation-0 rounded-lg mr-2"
                  density="comfortable"
                >
                  <v-icon>mdi-play</v-icon>
                </v-btn>

                <v-btn
                  icon
                  @click.stop="removeSong(idx)"
                  variant="plain"
                  class="elevation-0 rounded-lg mr-2"
                  density="comfortable"
                >
                  <v-icon>mdi-delete</v-icon>
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
                  @mouseenter="hoveredHeart = song.id"
                  @mouseleave="hoveredHeart = null"
                  @click.stop="toggleLike(song)"
                  variant="text"
                >
                  {{ isLiked(song)
                    ? 'mdi-heart'
                    : (hoveredHeart === song.id ? 'mdi-heart' : 'mdi-heart-outline') }}
                </v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
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

// ---------------------- //
// 🌟 Setup Vuex + data
// ---------------------- //
const store = useStore()

const hoverHome = ref(false)
const hoveredHeart = ref(null)

const hoverShowAll = ref(false)
// Simulation de playlist
const selectedPlaylist = computed(() => store.state.playlists?.[0] || { songs: [] })

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

function playSong(idx) {
  console.log('▶️ Play song index', idx)
}

function removeSong(idx) {
  console.log('🗑️ Remove song index', idx)
}

function toggleLike(song) {
  console.log('❤️ Toggle like', song.title)
}

function isLiked(song) {
  return false // logique à compléter
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
.text-decoration-underline {
  text-decoration: underline;
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
