import { createStore } from 'vuex'

export default createStore({
  state: {
    playlists: [],
    currentPlaylist: null,
    currentIndex: 0,
    currentSong: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    currentTime: 0,
    player: null,
    isPlayerReady: false
  },
  mutations: {
    setPlaylists(state, playlists) {
      state.playlists = playlists
    },
    setCurrentPlaylist(state, playlist) {
      state.currentPlaylist = playlist
    },
    setCurrentIndex(state, index) {
      state.currentIndex = index
      state.currentSong = state.currentPlaylist?.songs[index] || null
    },
    setCurrentSong(state, song) {
      state.currentSong = song
    },
    setIsPlaying(state, playing) {
      state.isPlaying = playing
    },
    setProgress(state, progress) {
      state.progress = progress
    },
    setDuration(state, duration) {
      state.duration = duration
    },
    setCurrentTime(state, time) {
      state.currentTime = time
    },
    setPlayer(state, player) {
      state.player = player
    },
    setIsPlayerReady(state, ready) {
      state.isPlayerReady = ready
    }
  },
  actions: {
    // Jouer une chanson
    async playSong({ state, commit, dispatch }, index) {
      commit('setCurrentIndex', index)
      const song = state.currentSong
      if (!song) return

      if (!state.player) {
        dispatch('createPlayer')
        await dispatch('waitPlayerReady')
      } else if (!state.isPlayerReady) {
        await dispatch('waitPlayerReady')
      }

      state.player.loadVideoById(song.videoId)
      dispatch('playVideo')
    },

    playVideo({ state, commit }) {
      if (!state.player || !state.isPlayerReady) return
      state.player.playVideo()
      commit('setIsPlaying', true)
      const intervalId = setInterval(() => {
        commit('setCurrentTime', state.player.getCurrentTime())
        commit('setProgress', state.player.getCurrentTime())
        commit('setDuration', state.player.getDuration())
        if (!state.isPlaying) clearInterval(intervalId)
      }, 500)
    },

    pauseVideo({ state, commit }) {
      if (!state.player) return
      state.player.pauseVideo()
      commit('setIsPlaying', false)
    },

    togglePlay({ state, dispatch }) {
      if (!state.isPlaying) dispatch('playVideo')
      else dispatch('pauseVideo')
    },

    nextSong({ state, commit, dispatch }) {
      if (!state.currentPlaylist?.songs.length) return
      const nextIndex = (state.currentIndex + 1) % state.currentPlaylist.songs.length
      commit('setCurrentIndex', nextIndex)
      state.player.loadVideoById(state.currentSong.videoId)
      dispatch('playVideo')
    },

    prevSong({ state, commit, dispatch }) {
      if (!state.currentPlaylist?.songs.length) return
      const prevIndex = (state.currentIndex - 1 + state.currentPlaylist.songs.length) % state.currentPlaylist.songs.length
      commit('setCurrentIndex', prevIndex)
      state.player.loadVideoById(state.currentSong.videoId)
      dispatch('playVideo')
    },

    createPlayer({ state, commit }) {
      if (!state.currentSong || state.player) return
      const player = new YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: state.currentSong.videoId,
        playerVars: { autoplay: 0, controls: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            commit('setIsPlayerReady', true)
            commit('setDuration', player.getDuration())
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              dispatch('nextSong')
            }
          }
        }
      })
      commit('setPlayer', player)
    },

    waitPlayerReady({ state }) {
      return new Promise(resolve => {
        const check = setInterval(() => {
          if (state.isPlayerReady) {
            clearInterval(check)
            resolve()
          }
        }, 50)
      })
    },

    seekVideo({ state }, value) {
      if (!state.player) return
      state.player.seekTo(value, true)
    }
  }
})
