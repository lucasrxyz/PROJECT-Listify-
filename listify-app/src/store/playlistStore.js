import { defineStore } from "pinia";

export const usePlaylistStore = defineStore("playlist", {
  state: () => ({
    playlists: [],
    currentPlaylist: null,
    currentTrackIndex: 0,
  }),

  actions: {
    async addSongToPlaylist(playlistId, youtubeUrl) {
      try {
        const response = await fetch(
          `https://noembed.com/embed?url=${encodeURIComponent(youtubeUrl)}`
        );
        const data = await response.json();

        const title = data.title || "Titre inconnu";

        const playlist = this.playlists.find((p) => p.id === playlistId);
        if (!playlist) return;

        playlist.songs.push({
          id: Date.now(),
          url: youtubeUrl,
          title,
        });
      } catch (err) {
        console.error("Erreur récupération titre:", err);
      }
    },

    setCurrentPlaylist(id) {
      this.currentPlaylist = this.playlists.find((p) => p.id === id) || null;
      this.currentTrackIndex = 0;
    },
  },
});
