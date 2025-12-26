<template>
  <v-container fluid class="py-10">
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 ml-5 mb-2">Liked songs</h1>
        <p>
          <span 
            class="opacity-50 cursor-pointer ml-5"
            style="color:#61f73cff;"
            @click="href('/')"
            @mouseover="hoverHome = true" 
            @mouseleave="hoverHome = false"
            :class="hoverHome ? 'text-decoration-underline' : ''"
          >Home</span>
          <span class="opacity-50" style="color:#61f73cff;">&nbsp;>&nbsp;</span>
          <span 
            class="opacity-70 cursor-pointer" 
            @click="href('/liked-songs')"
            style="color:#61f73cff;"
            @mouseover="hoverLikedSongs = true" 
            @mouseleave="hoverLikedSongs = false"
            :class="hoverLikedSongs ? 'text-decoration-underline' : ''"
          >Liked songs
          </span>
        </p>
      </v-col>
    </v-row>
  </v-container>


</template>

<script setup>
// ne pas supprimer
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const hoverHome = ref(false)
const hoverLikedSongs = ref(false)

const store = useStore()

const likedSongs = [];
const hoveredIcon = ref(null)

function href(path) {
  window.location.href = path
}
// ne pas supprimer
</script>