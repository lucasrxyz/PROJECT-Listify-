import { createStore } from 'vuex'

const LS_KEY = 'listify_playlists_v1'

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
    SET_PLAYLISTS(state, playlists) {
      state.playlists = playlists
      savePlaylists(state.playlists)
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
    addSong({ commit }, { playlistId, song }) {
      // song: { id, title, artist, youtubeId, url }
      commit('ADD_SONG_TO_PLAYLIST', { playlistId, song })
    },
    removeSong({ commit }, payload) {
      commit('REMOVE_SONG_FROM_PLAYLIST', payload)
    },
    playSong({ commit }, { playlistId, index = 0 }) {
      commit('PLAYER_SET_PLAYLIST', { playlistId, songIndex: index })
      commit('PLAYER_SET_PLAYING', true)
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
