<template>
  <v-app>
    <div class="animated-bg"></div>

    <v-layout class="h-screen transparent-layout">
      <!-- 🧭 Menu latéral -->
      <!-- <NavDrawer /> -->

      <!-- 🎵 Contenu principal -->
      <v-main class="transparent-main">
        <v-app-bar :elevation="0" height="55" app density="compact" class="transparent-bar">
          <v-spacer></v-spacer>

          <v-spacer></v-spacer>

          <!-- 👤 Profil / Connexion -->
          <div class="mr-3">
            <v-menu v-if="user" location="bottom end" class="text-none">
              <template #activator="{ props }" class="text-none">
                <v-btn v-bind="props" rounded="0" variant="text" class="text-white text-none" density="compact" size="large">
                  <span style="font-size:14px !important;" class="text-none">{{ user.name }}</span>
                  <v-icon size="18" class="ml-1 opacity-70">mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list density="compact" class="bg-darken elevation-0" style="min-width: 180px;border-radius:12px;background-color: rgba(0,0,0, 0.05) !important;">
                <v-list-item class="ma-1 rounded-lg" @click="manageUser">
                  <v-icon left class="mr-2" size="small">mdi-cog</v-icon>
                  Manage user
                </v-list-item>
                <v-list-item density="compact" color="red-accent-4" class="ma-1 rounded-lg" @click="disconnectUser">
                  <span style="color:#D50000;">
                    <v-icon class="mr-2" size="small">mdi-logout</v-icon>
                    Disconnect
                  </span>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn
              v-else
              color="white"
              variant="plain"
              :ripple="true"
              rounded="xl"
              @click="openLoginDialog"
            >
              <v-icon left class="mr-3" style="margin-bottom:2px;">mdi-account</v-icon>
              Guest
            </v-btn>
          </div>

          <!-- 🪟 Boutons fenêtre -->
          <v-btn :ripple="false" size="small" rounded="0" variant="plain" density="comfortable" icon="mdi-minus" @click="windowMinimize"></v-btn>
          <v-btn :ripple="false" size="small" rounded="0" variant="plain" density="comfortable" icon="mdi-square-outline" @click="windowMaximize"></v-btn>
          <v-btn :ripple="false" style="font-size:16px" class="mr-3" size="small" rounded="0" variant="plain" density="comfortable" icon="mdi-close" @click="windowClose"></v-btn>
        </v-app-bar>

        <!-- 🔸 Contenu -->
        <div class="router-wrapper">
          <router-view/>
        </div>
      </v-main>
    </v-layout>

    <!-- 🎧 Player persistant -->
    <PlayerBar />

    <!-- 🔐 Dialog login -->
    <v-dialog v-model="loginDialog" max-width="400px" persistent>
      <v-card class="pa-5 bg-darken">
        <v-card-title class="text-h6 mb-3">Login to Listify</v-card-title>
        <v-text-field
          v-model="username"
          label="Username"
          variant="outlined"
          density="comfortable"
          hide-details
        />
        <v-card-actions class="justify-end mt-4">
          <v-btn text @click="loginDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="loginUser">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PlayerBar from './components/AudioPlayer.vue'
import NavDrawer from './components/NavDrawer.vue'

const windowMinimize = () => window.electronAPI?.minimize()
const windowMaximize = () => window.electronAPI?.maximize()
const windowClose = () => window.electronAPI?.close()

// --------------------- 🧍 Gestion du profil local ---------------------
const user = ref(null)
const loginDialog = ref(false)
const username = ref('')

onMounted(() => {
  const saved = localStorage.getItem('listify_user')
  if (saved) user.value = JSON.parse(saved)
})

function openLoginDialog() {
  loginDialog.value = true
}

function loginUser() {
  if (!username.value.trim()) return
  user.value = { name: username.value.trim(), createdAt: new Date().toISOString() }
  localStorage.setItem('listify_user', JSON.stringify(user.value))
  loginDialog.value = false
  username.value = ''
}

function disconnectUser() {
  localStorage.removeItem('listify_user')
  user.value = null
}

function manageUser() {
  alert('Soon: user management screen 😎')
}
</script>

<style lang="scss">
html, body, #app {
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: #121212;
}

* {
  scrollbar-width: none;
  -ms-overflow-style: none;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
*::-webkit-scrollbar {
  display: none;
}

.transparent-bar {
  -webkit-app-region: drag;
}
.transparent-bar button,
.v-btn {
  -webkit-app-region: no-drag;
}

.v-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
