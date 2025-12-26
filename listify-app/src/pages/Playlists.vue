<template>
  <v-container fluid class="py-10">
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 ml-5 mb-2">Current playlists</h1>
        <p>
          <span
            style="color:#61f73cff;"
            class="opacity-50 cursor-pointer ml-5"
            to="/"
            @mouseover="hoverHome = true" 
            @mouseleave="hoverHome = false"
            :class="hoverHome ? 'text-decoration-underline' : ''"
          >Home</span>
          <span class="opacity-50" style="color:#61f73cff;">&nbsp;>&nbsp;</span>
          <span 
            class="opacity-70 cursor-pointer"
            style="color:#61f73cff;"
            to="/playlists"
            @mouseover="hoverPlaylists = true" 
            @mouseleave="hoverPlaylists = false"
            :class="hoverPlaylists ? 'text-decoration-underline' : ''"
          >Playlists
          </span>
        </p>
      </v-col>
      <v-col class="d-flex justify-end mr-10">
        
      </v-col>
    </v-row>
    
    <v-row>
      <!-- Liste des playlists -->
      <v-col cols="3">
        <v-list
          two-line
          class="rounded-0"
          style="max-height: 588px; overflow-y: auto; padding: 4px;border: 1px solid #61f73cff;">
          <v-list-item
            
            v-for="pl in playlists.filter(p => p.name.name && p.name.name.trim() !== '')"
            :key="pl.id"
            class="rounded-0"
            :class="{ 'primary--text': selectedPlaylist && selectedPlaylist.id === pl.id }"
            @click="selectPlaylist(pl)"
          >
            <template #prepend>
              <v-avatar size="56" rounded="0" class="mr-1">
                <v-img
                  v-if="pl.songs.length > 0"
                  :src="`https://img.youtube.com/vi/${pl.songs[0].youtubeId}/mqdefault.jpg`"
                  alt="Playlist thumbnail"
                />
                <v-icon v-else icon="mdi-music" size="25" color="grey"/>
              </v-avatar>
            </template>
          
            <v-list-item-content>
              <v-list-item-title>
                {{ pl.name.name }}&nbsp;
                <v-icon size="16" class="float-right hover-scale playlist-action" color="niceColor" @click.stop="deletePlaylist(pl.id)">mdi-delete</v-icon>
                <v-icon size="16" class="float-right hover-scale playlist-action" color="primary">mdi-image-edit</v-icon>
              </v-list-item-title>
              <v-list-item-subtitle>{{ pl.songs.length }} songs</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-btn 
            block
            color="niceColor" 
            :ripple="false"
            :loading="isLoading"
            @click="promptNewPlaylist" 
            variant="tonal"
            class="rounded-0">
            <v-icon class="mb-1 mr-2">mdi-plus</v-icon>
            New playlist
          </v-btn>
        </v-list>
      </v-col>

      <!-- Contenu de la playlist sélectionnée -->
      <v-col cols="8">
        <div v-if="!selectedPlaylist" class="pa-6">
          <p style="opacity: 0.7">Select a playlist or create a new one to add songs.</p>
        </div>

        <div v-else>
          <div class="d-flex align-center mb-2" style="border-bottom:1px solid rgba(255,255,255,0.2);">

            <h1 class="text-h5 mr-2">{{ selectedPlaylist.name.name }}</h1>
            <v-btn small density="compact" class="mr-4 rounded-0 elevation-0 text-none" color="niceColor" variant="text" @click="openAddSongDialog">
              <v-icon class="mr-1" size="15">mdi-plus</v-icon>&nbsp;<i>Add a new song</i>
            </v-btn>
            <span class="mr-4">////////////</span>
            <v-btn small density="compact" class="mr-1 rounded-0 elevation-0 text-none">
              <v-icon class="mr-1" size="15">mdi-shuffle</v-icon>&nbsp;<i>Shuffle</i>
            </v-btn>

            <v-btn small density="compact" class="mr-1 rounded-0 elevation-0 text-none" color="primary" variant="text" @click="playAll">
              <v-icon class="mr-1" size="15">mdi-play</v-icon>&nbsp;<i>Play</i>
            </v-btn>

            

          </div>

          <v-chip density="compact" class="mb-3 mr-2" label>{{ selectedPlaylist.songs.length }} songs</v-chip>
          <v-chip density="compact" class="mb-3" label>
            {{ selectedPlaylist.songs.timeLengthHour || "0" }}h {{ selectedPlaylist.songs.timeLengthMinute || "0" }}m
          </v-chip>
          <span class="ml-3 mr-2 mb-3" style="opacity: 0.4;"></span> <!-- ESPACE NE PAS SUPPRIMER -->
          <v-chip color="niceColor" v-for="style in  selectedPlaylist.name.styles" density="compact" class="mb-3 ml-1 mr-1" label>
            {{ style }}
          </v-chip>
          <v-list
            two-line
            class="rounded-lg"
            style="max-height: 500px; overflow-y: auto;"
          >
            <v-list-item
              v-for="(song, idx) in selectedPlaylist.songs"
              :key="song.id"
              :ripple="false"
              @click="playSong(idx)"
              class="rounded-0 hover:bg-grey-darken-3 transition-all hover-border"
            >
              <template #prepend @click.stop="playSong(idx)">
                <!-- <v-btn icon variant="plain" :ripple="false" class="elevation-0 rounded-0 mr-3" density="comfortable">
                  <v-icon>mdi-play</v-icon>
                </v-btn>
                <v-btn icon @click.stop="removeSong(idx)" variant="plain" :ripple="false" class="elevation-0 rounded-0 mr-5" density="comfortable">
                  <v-icon>mdi-delete</v-icon>
                </v-btn> -->
              
                <v-avatar size="56" rounded="0" class="mr-1">
                  <v-img :src="`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`" alt="Song thumbnail" />
                </v-avatar>
              </template>
            
              <v-list-item-content>
                <v-list-item-title  class="font-medium">
                  <span class="mr-3">{{ song.title || 'Untitled' }}</span>
                  <span class="opacity-70 mr-4">{{ song.artist || 'Random artist' }}</span>
                  <span class="opacity-50">{{ song.duration || '0:00' }}</span>
                  <v-icon
                  class="cursor-pointer transition-all float-right mr-10"
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
          </v-list>
        </div>
      </v-col>
    </v-row>

    <!-- Add song dialog -->
    <v-dialog v-model="addSongDialog" max-width="600" style="backdrop-filter: blur(4px);">
      <v-badge location="top" width="auto" class="rounded-xl" height="auto" color="transparent">
      <template #badge>
      <span
          style="
          font-size: 1.05rem;
          font-weight: 500;
          color: white;
          background: linear-gradient(135deg, rgba(231, 81, 238, 0.6), rgba(52, 47, 127, 0.45));
          padding: 3px 20px 3px 20px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;">
        <v-icon
          style="font-size: 24px; margin-bottom: 2px; margin-right: 8px;"
        >
          mdi-youtube
        </v-icon>
        Add a new song with a YouTube link
      </span>
      </template>
      <v-card style="border-radius:18px; background-color: rgba(0, 0, 0, 0.8) !important;">

        <v-card-text class="px-5 pb-0 mt-2">
          <!-- URL -->
          <v-text-field
            v-model="newSongUrl"
            prepend-inner-icon="mdi-youtube"
            density="compact"
            variant="outlined"
            placeholder="YouTube link (https://youtube.com/watch?v=...)"
            class="mb-3"
          />

          <!-- Preview musique -->
          <v-card
            v-if="newSongTitle || newSongArtist || currentThumbnail"
            variant="text"
            class="d-flex pa-1 rounded-lg"
            style="background-color: rgb(255, 255, 255, 0.035);"
          >
            <div
              style="width: 48px; height: 48px; flex-shrink: 0; margin-right: 12px;"
            >
              <!-- Image si dispo -->
              <v-img
                v-if="currentThumbnail"
                :src="currentThumbnail"
                width="48"
                height="48"
                class="rounded-lg"
                cover
              ></v-img>

              <!-- Placeholder si pas d’image -->
              <div
                v-else
                class="rounded-lg d-flex align-center justify-center"
                style="background-color: rgba(255,255,255,0.05); width:48px; height:48px;"
              >
                <v-icon color="grey" size="20">mdi-music-note</v-icon>
              </div>
            </div>

            <!-- Infos musique -->
            <div style="overflow: hidden; min-width: 0;">
              <v-card-title
                class="text-subtitle-1 pa-0 text-truncate"
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              >
                {{ newSongTitle || 'Song title' }}
              </v-card-title>
              <v-card-subtitle
                class="text-caption pa-0 text-truncate"
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              >
                {{ newSongArtist || 'Artist' }}
              </v-card-subtitle>
            </div>
          </v-card>

          <!-- Info alert -->
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="mt-4 mb-3 rounded-lg px-3 py-2 text-white"
            style="background-color: rgba(255,255,255, 0.03);"
            color="#2a2a2a"
          >
            <template #prepend>
              <v-icon size="18" class="mr-1" color="grey lighten-2">
                mdi-information-outline
              </v-icon>
            </template>
            <span style="opacity:0.7; font-size:0.85em;">
              Supported URL forms:
              <strong>youtube.com/watch?v=VIDEOID</strong>,
              <strong>youtu.be/VIDEOID</strong> or embed links.
            </span>
          </v-alert>
        </v-card-text>

        <v-card-actions class="px-5 pb-4">
          <v-spacer></v-spacer>
          <v-btn text @click="addSongDialog = false">Cancel</v-btn>
          <v-btn color="niceColor" variant="tonal" @click="confirmAddSong">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-badge>
</v-dialog>

  </v-container>
<v-dialog v-model="newPlaylistDialog" max-width="400" max-height="300" style="backdrop-filter: blur(4px);">
  <v-card style="border-radius:18px; background-color: rgba(0, 0, 0, 0.8) !important;">
    <v-card-text>
      <v-text-field
        v-model="newPlaylistName"
        prepend-icon="mdi-playlist-plus"
        label="Enter playlist name:"
        placeholder="My new playlist"
        variant="outlined"
        density="compact"
      />

      <!-- Scrollable music style chips -->
      <div class="d-flex overflow-x-auto py-2" style="gap: 8px;">
        <v-chip
          v-for="style in sortedStyles"
          :key="style"
          :variant="selectedStyles.includes(style) ? 'tonal' : 'outlined'"
          :color="selectedStyles.includes(style) ? 'niceColor' : undefined"
          class="cursor-pointer flex-shrink-0"
          :prepend-icon="selectedStyles.includes(style) ? '' : 'mdi-plus'"
          label
          @click="toggleStyle(style)"
        >
          {{ style }}
        </v-chip>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn variant="plain" @click="newPlaylistDialog = false">Cancel</v-btn>
      <v-btn variant="tonal" color="niceColor" @click="confirmNewPlaylist">Create</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


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

const newPlaylistDialog = ref(false)
const newPlaylistName = ref('')
const musicStyles = [
  'Underground', 'Rock', 'R&B', 'Rap', 'Trap', 'Alt. Trap', 'Drill', 'U.K Drill','Alt. Rock',
  'Nu-Rock','Pop', 'Jazz', 'Funk', 'Soul', 'EDM', 'House', 'Techno', 'Reggae',
  'Metal', 'Punk', 'Lo-fi', 'Classical', 'K-Pop', 'Synthwave', 'Indie', 'Chill',
  'Ambient sound', 'Vaporwave', 'Country', 'Folk', 'Disco', 'Gospel', 'Ska'
]
const hoverHome = ref(false)
const hoverPlaylists = ref(false)

const hoveredHeart = ref(null);
const currentThumbnail = computed(() => {
  if (!newSongUrl.value) return null

  // Récupère l’ID de la vidéo (regex compatible watch?v=, youtu.be/, embed/)
  const match = newSongUrl.value.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
  if (!match) return null

  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
})
const likedSongs = ref([]);
// Charger les songs likées depuis localStorage
onMounted(() => {
  const saved = localStorage.getItem("likedSongs");
  if (saved) likedSongs.value = JSON.parse(saved);
});

function toggleLike(song) {
  store.dispatch('toggleLike', song)
}

// Vérifie si une song est likée
function isLiked(song) {
  return store.state.likedSongs.some(s => s.youtubeId === song.youtubeId)
}

function href(path) {
  window.location.href = path
}

const sortedStyles = computed(() => {
  const selected = musicStyles.filter(s => selectedStyles.value.includes(s))
  const notSelected = musicStyles.filter(s => !selectedStyles.value.includes(s))
  return [...selected, ...notSelected]
})
const selectedStyles = ref([])

function toggleStyle(style) {
  const index = selectedStyles.value.indexOf(style)
  if (index >= 0) {
    selectedStyles.value.splice(index, 1)
  } else {
    selectedStyles.value.push(style)
  }
}

// --- Création / sélection / suppression ---
function promptNewPlaylist() {
  newPlaylistName.value = ''
  newPlaylistDialog.value = true
}


// Fonction de confirmation de création de playlist
function confirmNewPlaylist() {
  if (!newPlaylistName.value.trim()) return
  const playlistData = {
    name: newPlaylistName.value,
    styles: [...selectedStyles.value]
  }
  store.dispatch('createPlaylist', playlistData).then(pl => {
    selectedPlaylist.value = pl
  })
  newPlaylistDialog.value = false
  newPlaylistName.value = ''
  selectedStyles.value = []
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
async function fetchYouTubeMetadataNoembed(videoUrlOrId) {
  try {
    // Accepte soit l'URL complète soit juste l'ID
    let url
    if (/^[A-Za-z0-9_-]{11}$/.test(videoUrlOrId)) {
      url = `https://www.youtube.com/watch?v=${videoUrlOrId}`
    } else {
      url = videoUrlOrId
    }
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
    if (!res.ok) throw new Error('noembed error')
    const json = await res.json()
    // noembed returns fields: title, author_name, etc.
    return {
      title: json.title || null,
      artist: json.author_name || null
    }
  } catch (err) {
    // silent fail -> on renverra nulls
    console.warn('noembed failed', err)
    return { title: null, artist: null }
  }
}
// --- Ajouter chanson ---
async function confirmAddSong() {
  if (!selectedPlaylist.value) { 
    alert('Select a playlist first.'); 
    return; 
  }

  const ytId = extractYouTubeId(newSongUrl.value)
  if (!ytId) { 
    alert('Impossible d\'extraire l\'ID YouTube.'); 
    return; 
  }

  // valeurs utilisateur (peuvent être vides)
  let title = newSongTitle.value.trim()
  let artist = newSongArtist.value.trim()

  // Si manque titre ou artiste -> on essaye noembed
  if (!title || !artist) {
    const metadata = await fetchYouTubeMetadataNoembed(ytId)
    if (metadata) {
      if (!title && metadata.title) {
        // on nettoie un peu le titre retourné (supprime " - YouTube" si présent)
        title = metadata.title.replace(/\s*[-|]\s*YouTube$/i, '').trim()
      }
      if (!artist && metadata.artist) {
        artist = metadata.artist.trim()
      }

      // heuristique : si titre contient "Artist - Song", séparer
      if (!artist && title && title.includes(' - ')) {
        const parts = title.split(' - ')
        if (parts.length >= 2) {
          artist = parts[0].trim()
          title = parts.slice(1).join(' - ').trim()
        }
      }
    }
  }

  const song = {
    id: Date.now().toString(),
    title: title || `YouTube ${ytId}`,
    artist: artist || 'Unknown artist',
    youtubeId: ytId,
    url: newSongUrl.value
  }

  // dispatch vers le store (comme avant) — le store sauvegardera le bon titre
  store.dispatch('addSong', { playlistId: selectedPlaylist.value.id, song })

  const updated = store.state.playlists.find(p => p.id === selectedPlaylist.value.id)
  selectedPlaylist.value = JSON.parse(JSON.stringify(updated))
  addSongDialog.value = false
}



// --- Play / remove ---
function playSong(index) {
  store.dispatch('playSong', { playlistId: selectedPlaylist.value.id, index })
    .then(song => {
      if (song) {
        store.commit('addToRecentlyPlayed', song)
      }
    })
}
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
watch(newSongUrl, async (val) => {
  if (!val) {
    newSongTitle.value = ''
    newSongArtist.value = ''
    return
  }

  const ytId = extractYouTubeId(val)
  if (!ytId) return

  // tentative rapide : si les champs sont vides, on récupère metadata
  if (!newSongTitle.value.trim() || !newSongArtist.value.trim()) {
    const meta = await fetchYouTubeMetadataNoembed(ytId)
    if (meta) {
      if (!newSongTitle.value.trim() && meta.title) {
        newSongTitle.value = meta.title.replace(/\s*[-|]\s*YouTube$/i, '').trim()
      }
      if (!newSongArtist.value.trim() && meta.artist) {
        newSongArtist.value = meta.artist.trim()
      }
      // heuristique split "Artist - Title"
      if (!newSongArtist.value && newSongTitle.value.includes(' - ')) {
        const parts = newSongTitle.value.split(' - ')
        if (parts.length >= 2) {
          newSongArtist.value = parts[0].trim()
          newSongTitle.value = parts.slice(1).join(' - ').trim()
        }
      }
    }
  }
})

// --- Sélection via route ---
onMounted(() => {
  const pid = route.query.pid
  if (pid) {
    const pl = store.state.playlists.find(p => p.id === pid)
    if (pl) selectedPlaylist.value = pl
  }
})
</script>

<style scoped>
  .hover-scale {
    transform: scale(1) !important;
    transition: 0.15s ease-in-out;
    opacity:70%;
  }
    .hover-scale:hover {
      transform: scale(1.2) !important;
      transition: 0.15s ease-in-out;
      opacity:100%;
    }


  .hover-border {
    position: relative;
    border-left: 1px solid #61f73c;
  }

  .hover-border::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("../assets/frutigerMetro.png");
    background-size: 150%;
    
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
    pointer-events: none;
  }

    .hover-border:hover::before {
      opacity: 0.50;
    }
    .hover-border:hover {
      transition: opacity 0.15s ease-in-out;
      border-left: 3px solid #61f73c;
      box-shadow: inset 0 0 0 1px #61f73c40;
    }

  .playlist-action {
    opacity: 0;
    transform: translateX(4px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .v-list-item:hover .playlist-action {
    opacity: 1;
    transform: translateX(0);
  }
</style>