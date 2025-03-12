
<script setup>
import { ref, onMounted } from 'vue'
import ThemeToggle from './components/ThemeToggle.vue'
import PageMeta from './components/PageMeta.vue'
import { useHead } from '@vueuse/head'

// Set default metadata (will be overridden by page-specific metadata)
useHead({
  title: 'Free Online Image Resizer/Compression - High-Quality & Fast',
  meta: [
    { name: 'description', content: 'A free web app to optimize and compress your images' },
    { name: 'keywords', content: 'image optimizer, image compression, image converter, compress jpeg, compress png, compress webp' },
    { name: 'author', content: 'CompressPictures.com' },
    // Open Graph tags
    { property: 'og:title', content: 'Free Online Image Resizer/Compression - High-Quality & Fast' },
    { property: 'og:description', content: 'A free web app to optimize and compress your images' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://compresspictures.com' },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Free Online Image Resizer/Compression - High-Quality & Fast' },
    { name: 'twitter:description', content: 'A free web app to optimize and compress your images' }
  ]
})

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

      <!-- SEO Metadata -->
      <PageMeta />
      
      <!-- Main content -->
      <router-view v-slot="{ Component }">
        <component :is="Component" :isDarkMode="isDarkMode" @toggleTheme="toggleTheme" />
      </router-view>
    </div>
  </div>
</template>
