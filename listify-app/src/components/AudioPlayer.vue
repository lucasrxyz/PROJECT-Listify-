<template>
  <v-footer app padless height="80" color="#121212">
    <v-container fluid class="pa-0 d-flex align-center">
      <!-- Zone gauche : titre + artiste -->
      <v-card flat color="transparent" class="d-flex flex-column justify-center mr-4" style="width: 220px; height: 100%;">
        <v-card-title class="text-subtitle-1 pa-0">
          {{ currentSong ? currentSong.title : 'No song played' }}
        </v-card-title>
        <v-card-subtitle class="text-caption pa-0">
          {{ currentSong ? currentSong.artist : '' }}
        </v-card-subtitle>
      </v-card>

      <!-- Zone centrale : boutons -->
      <div class="d-flex align-center justify-center mx-4" style="flex: 0 0 auto;">
        <v-btn size="large" @click="prevSong" variant="plain" density="compact" icon="mdi-skip-previous"></v-btn>
        <v-btn size="large" @click="togglePlay" variant="plain" density="compact" :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"></v-btn>
        <v-btn size="large" @click="nextSong" variant="plain" density="compact" icon="mdi-skip-next"></v-btn>
      </div>

      <!-- Zone droite : barre de progression -->
      <v-progress-linear
        :value="progressPercent"
        height="4"
        color="primary"
        rounded
        class="flex-grow-1"
      ></v-progress-linear>

    </v-container>
  </v-footer>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
  }
}
</script>
