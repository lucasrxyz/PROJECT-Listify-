<template>
  <v-app>
    <!-- Barre supérieure -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Listify</v-toolbar-title>
    </v-app-bar>

    <!-- Contenu des pages -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Player persistant en bas -->
    <PlayerBar />
  </v-app>
</template>

<script setup>
import PlayerBar from './components/AudioPlayer.vue'
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
