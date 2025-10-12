<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">{{ playlist?.name }}</h1>

    <div v-if="playlist">
      <ul>
        <li
          v-for="(song, index) in playlist.songs"
          :key="song.id"
          class="cursor-pointer hover:underline"
          @click="playTrack(index)"
        >
          {{ song.title }}
        </li>
      </ul>

      <div class="mt-6">
        <iframe
          v-if="currentSong"
          width="560"
          height="315"
          :src="embedUrl(currentSong.url)"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div v-else>
      <p>Chargement de la playlist...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { usePlaylistStore } from "../store/playlistStore";

const route = useRoute();
const store = usePlaylistStore();

const playlist = computed(() => store.currentPlaylist);
const currentSong = computed(() =>
  playlist.value?.songs[store.currentTrackIndex]
);

const playTrack = (index) => {
  store.currentTrackIndex = index;
};

const embedUrl = (url) => {
  const videoId = new URL(url).searchParams.get("v");
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
};

onMounted(() => {
  const id = Number(route.params.id);
  store.setCurrentPlaylist(id);
});
</script>
