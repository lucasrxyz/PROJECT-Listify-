import { createStore } from 'vuex'

const LS_KEY = 'listify_playlists_v1'
const HISTORY_KEY = 'listify_recently_played_v1'

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Failed to load recently played', e)
    return []
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (e) {
    console.error('Failed to save recently played', e)
  }
}

function loadPlaylists() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Failed to load playlists from localStorage', e)
    return []
  }
}

function savePlaylists(playlists) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(playlists))
  } catch (e) {
    console.error('Failed to save playlists to localStorage', e)
  }
}

export default createStore({
  state: {
    playlists: loadPlaylists(), // array { id, name, songs: [{ id, title, artist, youtubeId, url }] }
    recentlyPlayed: loadHistory(),
    likedSongs: JSON.parse(localStorage.getItem('likedSongs') || '[]'),
    player: {
      playlistId: null,    // id of playlist being played
      songIndex: 0,        // index inside playlist.songs
      isPlaying: false,
      repeatMode: 0 // 0 = off, 1 = repeat playlist, 2 = repeat one     // whether to repeat the current song
    }
  },
  getters: {
    currentPlaylist(state) {
      return state.playlists.find(p => p.id === state.player.playlistId) || null
    },
    currentSong(state, getters) {
      const pl = getters.currentPlaylist
      if (!pl || !pl.songs || pl.songs.length === 0) return null
      return pl.songs[state.player.songIndex] || null
    }
  },
  mutations: {
    addToRecentlyPlayed(state, track) {
    // On évite les doublons en filtrant le son s’il est déjà là
    state.recentlyPlayed = [
      track,
      ...state.recentlyPlayed.filter(t => t.id !== track.id)
    ]

    // On limite à 5 éléments
    if (state.recentlyPlayed.length > 5) {
      state.recentlyPlayed = state.recentlyPlayed.slice(0, 5)
    }

    saveHistory(state.recentlyPlayed)
  },
    SET_PLAYLISTS(state, playlists) {
      state.playlists = playlists
      savePlaylists(state.playlists)
    },
    ADD_LIKED_SONG(state, song) {
    if (!state.likedSongs.find(s => s.youtubeId === song.youtubeId)) {
      state.likedSongs.unshift(song)
      localStorage.setItem('likedSongs', JSON.stringify(state.likedSongs))
    }
  },
  REMOVE_LIKED_SONG(state, song) {
    state.likedSongs = state.likedSongs.filter(s => s.youtubeId !== song.youtubeId)
    localStorage.setItem('likedSongs', JSON.stringify(state.likedSongs))
  },
    ADD_PLAYLIST(state, playlist) {
      state.playlists.push(playlist)
      savePlaylists(state.playlists)
    },
    REMOVE_PLAYLIST(state, playlistId) {
      state.playlists = state.playlists.filter(p => p.id !== playlistId)
      savePlaylists(state.playlists)
      // if current playlist removed, reset player
      if (state.player.playlistId === playlistId) {
        state.player.playlistId = null
        state.player.songIndex = 0
        state.player.isPlaying = false
      }
    },
    PLAYER_SET_CURRENT_SONG(state, song) {
      state.currentSong = song
    },
    ADD_TO_RECENTLY_PLAYED(state, song) {
      // On garde max 20 derniers sons
      state.recentlyPlayed = [song, ...state.recentlyPlayed.filter(s => s.id !== song.id)].slice(0, 20)
    },
    ADD_SONG_TO_PLAYLIST(state, { playlistId, song }) {
      const pl = state.playlists.find(p => p.id === playlistId)
      if (!pl) return
      pl.songs.push(song)
      savePlaylists(state.playlists)
    },
    REMOVE_SONG_FROM_PLAYLIST(state, { playlistId, songIndex }) {
      const pl = state.playlists.find(p => p.id === playlistId)
      if (!pl) return
      pl.songs.splice(songIndex, 1)
      savePlaylists(state.playlists)
    },
    // Player mutations
    PLAYER_SET_PLAYLIST(state, { playlistId, songIndex = 0 }) {
      state.player.playlistId = playlistId
      state.player.songIndex = songIndex
    },
    PLAYER_SET_INDEX(state, index) {
      state.player.songIndex = index
    },
    PLAYER_SET_PLAYING(state, isPlaying) {
      state.player.isPlaying = isPlaying
    },
    PLAYER_SET_REPEAT_MODE(state, mode) {
      state.player.repeatMode = mode
    }
  },
  actions: {
    createPlaylist({ commit }, name) {
      const playlist = {
        id: Date.now().toString(),
        name,
        songs: []
      }
      commit('ADD_PLAYLIST', playlist)
      return playlist
    },
    deletePlaylist({ commit }, playlistId) {
      commit('REMOVE_PLAYLIST', playlistId)
    },
    playSongDirectly({ commit, state }, song) {
      // Crée playlist "recent" si nécessaire
      let recentPlaylist = state.playlists.find(p => p.id === 'recent')
      if (!recentPlaylist) {
        commit('ADD_PLAYLIST', { id: 'recent', name: 'Recently Played', songs: [] })
        recentPlaylist = state.playlists.find(p => p.id === 'recent')
      }
    
      // Ajoute la chanson si elle n'y est pas
      if (!recentPlaylist.songs.find(s => s.id === song.id)) {
        commit('ADD_SONG_TO_PLAYLIST', { playlistId: 'recent', song })
      }
    
      const songIndex = recentPlaylist.songs.findIndex(s => s.id === song.id)
    
      // ⚡ Si la chanson est déjà en train de jouer dans le player, on ne fait que s'assurer que c'est en lecture
      if (state.player.playlistId === 'recent' && state.player.songIndex === songIndex) {
        commit('PLAYER_SET_PLAYING', true) // force play
      } else {
        commit('PLAYER_SET_PLAYLIST', { playlistId: 'recent', songIndex })
        commit('PLAYER_SET_PLAYING', true)
      }
    
      // Ajouter à l'historique
      commit('ADD_TO_RECENTLY_PLAYED', song)
      commit('PLAYER_SET_PLAYING', true)
    },
    toggleLike({ commit, state }, song) {
    const isLiked = state.likedSongs.some(s => s.youtubeId === song.youtubeId)
    if (isLiked) commit('REMOVE_LIKED_SONG', song)
    else commit('ADD_LIKED_SONG', song)
  },
    playSong({ state, commit }, { playlistId, index = 0 }) {
      // 1️⃣ On cherche la playlist correspondante
      const playlist = state.playlists.find(p => p.id === playlistId)
      if (!playlist || !playlist.songs || !playlist.songs[index]) {
        console.warn('Song not found for playSong')
        return
      }
    
      // 2️⃣ On récupère la chanson à jouer
      const song = playlist.songs[index]
    
      // 3️⃣ On applique les mutations existantes (lecture)
      commit('PLAYER_SET_PLAYLIST', { playlistId, songIndex: index })
      commit('PLAYER_SET_PLAYING', true)
    
      // 4️⃣ On ajoute la chanson à l’historique (recentlyPlayed)
      commit('addToRecentlyPlayed', song)
    
      // 5️⃣ On retourne la chanson au cas où tu veux la manipuler ailleurs
      return song
    },
    togglePlay({ commit, state }) {
      commit('PLAYER_SET_PLAYING', !state.player.isPlaying)
    },
    toggleRepeat({ commit, state }) {
      const nextMode = (state.player.repeatMode + 1) % 3
      commit('PLAYER_SET_REPEAT_MODE', nextMode)
    },
    next({ commit, state }) {
      const playlist = state.playlists.find(p => p.id === state.player.playlistId)
      if (!playlist || playlist.songs.length === 0) return
      let nextIndex = state.player.songIndex + 1
      if (nextIndex >= playlist.songs.length) nextIndex = 0
      commit('PLAYER_SET_INDEX', nextIndex)
      commit('PLAYER_SET_PLAYING', true)
    },
    prev({ commit, state }) {
      const playlist = state.playlists.find(p => p.id === state.player.playlistId)
      if (!playlist || playlist.songs.length === 0) return
      let prevIndex = state.player.songIndex - 1
      if (prevIndex < 0) prevIndex = playlist.songs.length - 1
      commit('PLAYER_SET_INDEX', prevIndex)
      commit('PLAYER_SET_PLAYING', true)
    },
    // Update playlists array (for external edits)
    setPlaylists({ commit }, playlists) {
      commit('SET_PLAYLISTS', playlists)
    }
  },
  modules: {
  }
})
