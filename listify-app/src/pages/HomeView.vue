<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Vos Playlists</h1>
      </v-col>

      <v-col
        v-for="playlist in playlists"
        :key="playlist.id"
        cols="12" sm="6" md="4"
      >
        <PlaylistCard :playlist="playlist" @play="goToPlayer" />
      </v-col>
    </v-row>

    <v-btn color="primary" class="mt-8" @click="dialog = true">
      Créer une nouvelle playlist
    </v-btn>

    <!-- Dialogue création playlist -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Créer une playlist</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newPlaylistName"
            label="Nom de la playlist"
            autofocus
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="createPlaylist">Créer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PlaylistCard from '../components/PlaylistCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const playlists = ref([])

// Dialog & nouvelle playlist
const dialog = ref(false)
const newPlaylistName = ref('')

onMounted(() => {
  const data = localStorage.getItem('playlists')
  playlists.value = data ? JSON.parse(data) : []
})

const createPlaylist = () => {
  if (!newPlaylistName.value) return
  const newPlaylist = {
    id: Date.now(),
    name: newPlaylistName.value,
    songs: []
  }
  playlists.value.push(newPlaylist)
  localStorage.setItem('playlists', JSON.stringify(playlists.value))
  newPlaylistName.value = ''
  dialog.value = false
}

const goToPlayer = (playlist) => {
  router.push({ name: 'player', params: { id: playlist.id } })
}
</script>
