<template>
  <v-container class="py-10 ml-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Recently played</h1>
      </v-col>
    </v-row>

    <v-row>

      <v-col cols="2">
        <v-card
          width="200"
          height="200"
          max-width="200"
          max-height="200"

          class="rounded-lg"
          color="#ffd000"
          title="Liked Songs"
          subtitle="24 songs"

          elevation-0
          to="/liked-songs"
          link
          :ripple="false"
        >
        <v-card-text class="text-center">
          <v-icon size="64">mdi-heart-outline</v-icon>
        </v-card-text>
      </v-card>
      </v-col>

    <v-col cols="2">
      <v-card
          width="200"
          height="200"
          max-width="200"
          max-height="200"

          class="rounded-lg"
          title="Playlist name"
          subtitle="... songs"

          elevation-0
          link
          :ripple="false"
        >
        <v-card-text class="text-center">
          <v-icon size="64">mdi-heart-outline</v-icon>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="2">
    </v-col>
    <v-col cols="2">
    </v-col>

    <v-col cols="4">
    </v-col>
  </v-row>

  </v-container>
</template>
<script setup>
</script>
