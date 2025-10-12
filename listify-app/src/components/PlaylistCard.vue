<template>
  <v-card
    class="hover:scale-105 transition cursor-pointer"
    @click="$emit('play', playlist)"
  >
    <v-card-title>{{ playlist.name }}</v-card-title>
    <v-card-text>
      {{ playlist.songs.length }} chansons
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  playlist: Object
})
</script>
