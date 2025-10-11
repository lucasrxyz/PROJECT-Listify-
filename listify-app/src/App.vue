<template>
  <v-app>
    <!-- Layout principal -->
    <v-navigation-drawer app permanent width="240">
      <Sidebar />
    </v-navigation-drawer>

    <v-main class="bg-grey-darken-4">
      <v-container fluid>
        <PlaylistView />
      </v-container>
    </v-main>

    <!-- Lecteur audio en bas -->
    <v-footer app padless height="90" class="bg-grey-darken-3">
      <AudioPlayer />
    </v-footer>
  </v-app>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import PlaylistView from './components/PlaylistView.vue'
import AudioPlayer from './components/AudioPlayer.vue'
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
