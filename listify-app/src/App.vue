<template>
  <v-app>
    <div class="animated-bg"></div>

    <v-layout class="h-screen transparent-layout">
      <!-- 🧭 Menu latéral -->
      <NavDrawer />

      <!-- 🎵 Contenu principal -->
      <v-main class="transparent-main">
        <v-app-bar :elevation="0" height="65" app density="compact" class="transparent-bar">
          <v-spacer></v-spacer>

          <!-- 🔍 Barre de recherche -->
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

          <!-- 👤 Profil / Connexion -->
          <div class="mr-3">
            <v-menu v-if="user" location="bottom end">
              <template #activator="{ props }">
                <v-btn v-bind="props" rounded="xl" variant="text" class="text-white" density="compact" size="large">
                  <v-icon left class="mr-3" style="margin-top:2px;">mdi-account-circle</v-icon>
                  <span style="font-size:16px !important;">{{ user.name }}</span>
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

.router-wrapper {
  padding: 0px;
  margin: 20px;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(24, 24, 24, 0.3);
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
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 50% 100%; }
}

.transparent-layout {
  backdrop-filter: blur(15px);
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
  -webkit-app-region: drag;
}
.transparent-bar button,
.v-btn {
  -webkit-app-region: no-drag;
}

.v-container,
.v-list,
.v-navigation-drawer {
  background-color: rgba(24, 24, 24, 0.1) !important;
  backdrop-filter: blur(10px);
}

.v-footer {
  background: rgba(18, 18, 18, 0.3) !important;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* 🌙 --- STYLE DARK --- */
.bg-darken {
  background: rgba(24, 24, 24, 0.9) !important;
  color: white;
}
</style>
