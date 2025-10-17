<template>
  <v-app>
    <div class="animated-bg"></div> <!-- 🌫️ Fond animé flouté -->

    <v-layout class="h-screen transparent-layout">
      <!-- Menu latéral -->
      <NavDrawer />

      <!-- Contenu principal -->
      <v-main class="transparent-main">
        <v-app-bar :elevation="0" height="65" app density="compact" class="transparent-bar">
          <v-spacer></v-spacer>
          <v-text-field
            placeholder="Search"
            variant="outlined"
            density="compact"
            size="x-small"
            rounded="lg"
            hide-details
            prepend-inner-icon="mdi-magnify"
            class="mx-auto ml-2"
            style="max-width: 400px; width: 50%;margin-bottom:1px;"
          />

          <v-spacer></v-spacer>
          <v-btn :ripple="false" size="small" rounded="0" variant="plain" density="comfortable" icon="mdi-minus" @click="windowMinimize"></v-btn>
          <v-btn :ripple="false" size="small" rounded="0" variant="plain" density="comfortable" icon="mdi-square-outline" @click="windowMaximize"></v-btn>
          <v-btn :ripple="false" style="font-size:16px" class="mr-3" size="small" rounded="0" variant="plain" density="comfortable" icon="mdi-close" @click="windowClose"></v-btn>
          <br />
        </v-app-bar>

        <div class="router-wrapper">
          <router-view/>
        </div>
      </v-main>
    </v-layout>

    <!-- Player persistant -->
    <PlayerBar />
  </v-app>
</template>

<script setup>
import PlayerBar from './components/AudioPlayer.vue'
import NavDrawer from './components/NavDrawer.vue'

const windowMinimize = () => window.electronAPI?.minimize()
const windowMaximize = () => window.electronAPI?.maximize()
const windowClose = () => window.electronAPI?.close()
</script>

<style lang="scss">
html, body, #app {
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: #121212;
}

/* Supprimer les scrollbars */
* {
  scrollbar-width: none;
  -ms-overflow-style: none;
  user-select: none;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none;     /* IE/Edge */
}
*::-webkit-scrollbar {
  display: none;
}
.router-wrapper {
  padding: 0px;         // tu peux ajuster la marge
  margin: 20px;
  border-radius: 24px;   // arrondir les coins
  overflow: hidden;      // pour que le contenu ne dépasse pas les coins arrondis
  background: rgba(24, 24, 24, 0.3); // léger fond translucide si tu veux
  backdrop-filter: blur(10px);
}
/* 🌫️ --- FOND ANIMÉ --- */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  background: radial-gradient(circle at 20% 30%, #ffffff 0%, transparent 40%),
              radial-gradient(circle at 70% 70%, #9e84dd 0%, transparent 40%),
              radial-gradient(circle at 40% 80%, #64647e 0%, transparent 45%);
  background-size: 200% 200%;
  filter: blur(60px);
  animation: moveBg 20s infinite alternate ease-in-out;
}

@keyframes moveBg {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 50% 100%;
  }
}

/* 🌙 --- LAYOUT TRANSPARENT --- */
.transparent-layout {
  backdrop-filter: blur(15px),;
  background: rgba(18, 18, 18, 0.3);
  position: relative;
  z-index: 0;
}

.transparent-main {
  background: rgba(18, 18, 18, 0.2) !important;
  backdrop-filter: blur(10px);
}

.transparent-bar {
  background: rgba(24, 24, 24, 0.4) !important;
  backdrop-filter: blur(12px);
  -webkit-app-region: drag; /* ⬅️ Permet de bouger la fenêtre */
}
.transparent-bar button,
.v-btn {
  -webkit-app-region: no-drag; /* ⬅️ Les boutons restent cliquables */
}
/* --- Effet “verre” subtil sur tout le contenu --- */

.v-container,
.v-list,
.v-navigation-drawer {
  background-color: rgba(24, 24, 24, 0.1) !important;
  backdrop-filter: blur(10px);
}

/* --- Footer player --- */
.v-footer {
  background: rgba(18, 18, 18, 0.3) !important;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
