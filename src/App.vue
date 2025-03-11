
<script setup>
import { ref, onMounted } from 'vue'
import ThemeToggle from './components/ThemeToggle.vue'

// Theme state
const isDarkMode = ref(false)

// Initialize theme based on user preference
onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = prefersDark
  document.documentElement.classList.toggle('dark', isDarkMode.value)
})

// Toggle theme
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'dark' : 'light'">
    <div class="w-full px-4 md:px-6">
      <!-- Header with theme toggle -->
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-lg">
          <div class="flex items-center">
            <img src="./assets/logo.png" alt="Logo" class="w-8 h-8 mr-2 filter dark:invert-0 invert grayscale dark:grayscale-0"> Compress <span class="text-green-600 dark:text-green-400">Pictures.com</span>
          </div>
        </h1>
        <ThemeToggle :is-dark="isDarkMode" @toggle="toggleTheme" />
      </header>

      <!-- Main content -->
      <router-view v-slot="{ Component }">
        <component :is="Component" :isDarkMode="isDarkMode" @toggleTheme="toggleTheme" />
      </router-view>
    </div>
  </div>
</template>
