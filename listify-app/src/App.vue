<template>
  <v-app>
    <v-layout class="h-screen">

      <!-- Menu latéral -->
      <NavDrawer />

      <!-- Contenu principal -->
      <v-main style="background-color: #181818 !important;">
        <v-app-bar :elevation="0" app density="compact" color="#181818" dark height="72">
          <v-spacer></v-spacer>
          <v-text-field
            placeholder="Search"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details
            prepend-inner-icon="mdi-magnify"
            class="mx-auto ml-2 mt-2"
            style="max-width: 400px; width: 50%;"
          />

          <!-- Spacer droite -->
          <v-spacer></v-spacer>
          <!-- Boutons fenêtre (min, max, close) -->
          <v-btn size="small" rounded="0" variant="plain" density="comfortable" icon="mdi-minus"></v-btn>
          <v-btn size="small" rounded="0" variant="plain" density="comfortable" icon="mdi-square-outline"></v-btn>
          <v-btn style="font-size:16px" class="mr-3" size="small" rounded="0" variant="plain" density="comfortable" icon="mdi-close"></v-btn>

        </v-app-bar>

        <router-view />
      </v-main>
    </v-layout>

    <!-- Player persistant -->
    <PlayerBar />
  </v-app>
</template>

<script setup>
import PlayerBar from './components/AudioPlayer.vue'
import NavDrawer from './components/NavDrawer.vue'
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

/* Pour tous les navigateurs et tous les éléments */
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer / Edge */
}

*::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.v-application {
  background: transparent !important;
}
</style>
