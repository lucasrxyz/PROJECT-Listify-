<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const playlists = computed(() => store.state.playlists)

// Exclure certaines playlists
const filteredPlaylists = computed(() =>
  playlists.value.filter(
    (p) => !['recent', 'liked', 'all', 'shuffled','allShuffled'].includes(p.id)
  )
)

function createPlaylist() {
  const name = prompt('Nom de la nouvelle playlist :')
  if (!name) return
  store.dispatch('createPlaylist', name)
}

function openPlaylist(id) {
  router.push({ path: '/playlists', query: { pid: id } })
}
</script>

<template>
  <v-navigation-drawer
    class="mr-2"
    app
    permanent
    width="250"
    color="#121212"
    dark
  >
    <!-- MENU PRINCIPAL -->
    <v-list class="py-4 ma-1">
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        prepend-icon="mdi-home-outline"
        title="Home"
        to="/"
        link
      />
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        prepend-icon="mdi-folder-outline"
        title="Playlists"
        to="/playlists"
        link
      />
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        prepend-icon="mdi-heart-outline"
        title="Liked Songs"
        to="/liked-songs"
        link
      />
    </v-list>

    <!-- LIBRARY -->
    <v-list density="compact">
      <v-list-title class="ml-3" style="opacity: 50%; font-size: 85%;">
        &nbsp;&nbsp;&nbsp;YOUR LIBRARY
      </v-list-title>

      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        title="Recently Played"
        to="/recently-played"
        link
      />
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        title="Local Files"
        to="/local-files"
        link
      />
      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        title="Liked Artists"
        to="/liked-artists"
        link
      />
    </v-list>

    <!-- PLAYLISTS -->
    <v-list density="compact">
      <v-list-title class="ml-3" style="opacity: 50%; font-size: 85%;">
        &nbsp;&nbsp;&nbsp;PLAYLISTS
      </v-list-title>

      <v-list-item
        class="mr-2 ml-2 mt-1 rounded-lg"
        prepend-icon="mdi-plus"
        title="NEW PLAYLIST"
        @click="createPlaylist"
      />

      <!-- 🔽 Playlists dynamiques filtrées -->
      <v-list-item
        v-for="playlist in filteredPlaylists"
        :key="playlist.id"
        :title="playlist.name.name"
        :to="`/playlists`"
        link
        :active="false"
        class="mr-2 ml-2 mt-1 rounded-lg"
        @click.prevent="openPlaylist(playlist.id)"
      />
    </v-list>
  </v-navigation-drawer>
</template>
