<template>
  <v-container fluid class="py-10 ml-10">
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 mb-6">Current playlists</h1>
      </v-col>
      <v-col class="d-flex justify-end mr-10">
        <v-btn color="niceColor" :ripple="false" @click="promptNewPlaylist" variant="text">
          <v-icon class="mb-1 mr-2">mdi-plus</v-icon>New playlist
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <!-- Liste des playlists -->
      <v-col cols="3">
        <v-list two-line>
          <v-list-item
            v-for="pl in playlists"
            :key="pl.id"
            :class="{ 'primary--text': selectedPlaylist && selectedPlaylist.id === pl.id }"
            @click="selectPlaylist(pl)"
            class="rounded-lg mb-2 mr-2 ml-2"
          >
            <template #prepend>
              <v-avatar size="56" rounded="lg" class="mr-3">
                <v-img
                  v-if="pl.songs.length > 0"
                  :src="`https://img.youtube.com/vi/${pl.songs[0].youtubeId}/mqdefault.jpg`"
                  alt="Playlist thumbnail"
                />
                <v-icon v-else icon="mdi-music" size="32" color="grey"/>
              </v-avatar>
            </template>

            <v-list-item-content>
              <v-list-item-title>
                {{ pl.name }}&nbsp;&nbsp;&nbsp;
                <v-btn icon @click.stop="deletePlaylist(pl.id)" rounded-0 elevation="0" variant="text" class="rounded-lg" density="comfortable">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-title>
              <v-list-item-subtitle>{{ pl.songs.length }} songs</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- Contenu de la playlist sélectionnée -->
      <v-col cols="8">
        <div v-if="!selectedPlaylist" class="pa-6">
          <p style="opacity: 0.7">Select a playlist or create a new one to add songs.</p>
        </div>

        <div v-else>
          <div class="d-flex align-center mb-4">
            <v-btn small class="mr-3 rounded-lg elevation-0">
              <v-icon>mdi-shuffle</v-icon>
            </v-btn>
            <v-btn class="ml-2 mr-3 rounded-lg elevation-0" color="niceColor" variant="tonal" @click="playAll">
              <v-icon class="mb-1 mr-2">mdi-play</v-icon>Play
            </v-btn>
            <v-divider vertical class="flex-grow-1 mr-4"></v-divider>

            <h1 class="text-h5 mr-4">{{ selectedPlaylist.name }}</h1>

            <v-btn class="elevation-0 rounded-lg" small variant="text" @click="openAddSongDialog">
              <v-icon class="mb-1 mr-2">mdi-plus</v-icon>Add
            </v-btn>
          </div>

          <v-chip density="compact" class="mb-3 mr-2" label>{{ selectedPlaylist.songs.length }} songs</v-chip>
          <v-chip density="compact" class="mb-3" label>
            {{ selectedPlaylist.songs.timeLengthHour || "0" }}h {{ selectedPlaylist.songs.timeLengthMinute || "0" }}m
          </v-chip>

          <v-list two-line class="rounded-lg">
            <v-list-item
              v-for="(song, idx) in selectedPlaylist.songs"
              :key="song.id"
              @click="dsds(idx)"
              class="rounded-lg hover:bg-grey-darken-3 transition-all mb-2 mr-2 ml-2"
            >
              <template #prepend>
                <v-btn icon @click.stop="playSong(idx)" variant="plain" class="elevation-0 rounded-lg mr-5" density="comfortable">
                  <v-icon>mdi-play</v-icon>
                </v-btn>
                <v-btn icon @click.stop="removeSong(idx)" variant="plain" class="elevation-0 rounded-lg mr-5" density="comfortable">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>

                <v-avatar size="56" rounded="lg" class="mr-3">
                  <v-img :src="`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`" alt="Song thumbnail" />
                </v-avatar>
              </template>

              <v-list-item-content>
                <v-list-item-title class="font-medium">
                  <span class="mr-3">{{ song.title || 'Untitled' }}</span>
                  <span class="opacity-70 mr-4">{{ song.artist || 'Random artist' }}</span>
                  <span class="opacity-50">{{ song.duration || '0:00' }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
    </v-row>

    <!-- Add song dialog -->
    <v-dialog v-model="addSongDialog" max-width="600">
      <v-card>
        <v-card-title>Add a YouTube URL</v-card-title>
        <v-card-text>
          <v-text-field v-model="newSongUrl" label="YouTube link (https://youtube.com/watch?v=...)" />
          <v-text-field v-model="newSongTitle" label="Title (optional)" />
          <v-text-field v-model="newSongArtist" label="Artist (optional)" />
          <p style="opacity:0.7; font-size: 0.9em;">Supported URL forms: youtube.com/watch?v=VIDEOID or youtu.be/VIDEOID or embed links.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="addSongDialog = false">Cancel</v-btn>
          <v-btn text @click="confirmAddSong">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()

const playlists = computed(() => store.state.playlists)
const selectedPlaylist = ref(null)

const addSongDialog = ref(false)
const newSongUrl = ref('')
const newSongTitle = ref('')
const newSongArtist = ref('')

// --- Création / sélection / suppression ---
function promptNewPlaylist() {
  const name = prompt('Nom de la nouvelle playlist :')
  if (!name) return
  store.dispatch('createPlaylist', name).then(pl => {
    selectedPlaylist.value = pl
  })
}
function selectPlaylist(pl) {
  selectedPlaylist.value = pl
}
function deletePlaylist(id) {
  if (!confirm('Supprimer cette playlist ?')) return
  store.dispatch('deletePlaylist', id)
  if (selectedPlaylist.value && selectedPlaylist.value.id === id) selectedPlaylist.value = null
}
function openAddSongDialog() {
  newSongUrl.value = ''
  newSongTitle.value = ''
  newSongArtist.value = ''
  addSongDialog.value = true
}

// --- Gestion des IDs YouTube ---
function extractYouTubeId(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    if (u.searchParams && u.searchParams.get('v')) return u.searchParams.get('v')
    const parts = u.pathname.split('/')
    const idx = parts.indexOf('embed')
    if (idx >= 0 && parts.length > idx + 1) return parts[idx + 1]
  } catch (e) {}
  const m = url.match(/[A-Za-z0-9_-]{11}/)
  return m ? m[0] : null
}

// --- Ajouter chanson ---
function confirmAddSong() {
  if (!selectedPlaylist.value) { alert('Select a playlist first.'); return }
  const ytId = extractYouTubeId(newSongUrl.value)
  if (!ytId) { alert('Impossible d\'extraire l\'ID YouTube.'); return }

  const song = {
    id: Date.now().toString(),
    title: newSongTitle.value || `YouTube ${ytId}`,
    artist: newSongArtist.value || '',
    youtubeId: ytId,
    url: newSongUrl.value
  }

  store.dispatch('addSong', { playlistId: selectedPlaylist.value.id, song })
  const updated = store.state.playlists.find(p => p.id === selectedPlaylist.value.id)
  selectedPlaylist.value = JSON.parse(JSON.stringify(updated))
  addSongDialog.value = false
}

// --- Play / remove ---
function playSong(index) { store.dispatch('playSong', { playlistId: selectedPlaylist.value.id, index }) }
function playAll() { if (!selectedPlaylist.value?.songs.length) return; store.dispatch('playSong', { playlistId: selectedPlaylist.value.id, index: 0 }) }
function removeSong(idx) {
  if (!selectedPlaylist.value) return
  if (!confirm('Remove this song?')) return
  store.dispatch('removeSong', { playlistId: selectedPlaylist.value.id, songIndex: idx })
  const updated = store.state.playlists.find(p => p.id === selectedPlaylist.value.id)
  selectedPlaylist.value = JSON.parse(JSON.stringify(updated))
}

// --- API YouTube + calcul durée ---
async function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) return
  await new Promise(resolve => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => resolve()
  })
}

async function fetchVideoDuration(youtubeId) {
  await loadYouTubeAPI()
  return new Promise(resolve => {
    const div = document.createElement('div')
    div.style.display = 'none'
    document.body.appendChild(div)
    const player = new YT.Player(div, {
      videoId: youtubeId,
      events: {
        onReady: (e) => {
          const dur = e.target.getDuration()
          player.destroy()
          div.remove()
          resolve(dur)
        }
      }
    })
  })
}

async function calculatePlaylistTime(pl) {
  if (!pl || !pl.songs?.length) return

  await loadYouTubeAPI()

  const durations = await Promise.all(
    pl.songs.map(async s => {
      const dur = await fetchVideoDuration(s.youtubeId)
      s.duration = formatDuration(dur)
      return dur
    })
  )

  const totalSec = durations.reduce((acc, val) => acc + val, 0)
  pl.songs.timeLengthHour = Math.floor(totalSec / 3600)
  pl.songs.timeLengthMinute = Math.floor((totalSec % 3600) / 60)
}
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `${m}:${s.toString().padStart(2,'0')}`
}
// --- Watchers ---
watch(selectedPlaylist, (pl) => { if (pl) calculatePlaylistTime(pl) }, { immediate: true })
watch(() => store.state.playlists, (newVal) => {
  if (!selectedPlaylist.value) return
  const pl = newVal.find(p => p.id === selectedPlaylist.value.id)
  selectedPlaylist.value = pl || null
}, { deep: true })

// --- Sélection via route ---
onMounted(() => {
  const pid = route.query.pid
  if (pid) {
    const pl = store.state.playlists.find(p => p.id === pid)
    if (pl) selectedPlaylist.value = pl
  }
})
</script>
