<script setup>
import { ref, onMounted } from 'vue'
import ThemeToggle from './components/ThemeToggle.vue'
import PageMeta from './components/PageMeta.vue'
import ConsentBanner from './components/ConsentBanner.vue'
import { useHead } from '@vueuse/head'

// Set default metadata (will be overridden by page-specific metadata)
useHead({
  title: 'Free Online Image Resizer/Compression - High-Quality & Fast',
  meta: [
    { name: 'description', content: 'Effortlessly compress and convert images for any platform with high quality.' },
    { name: 'keywords', content: 'image optimizer, image compression, image converter, compress jpeg, compress png, compress webp' },
    { name: 'author', content: 'CompressPictures.com' },
    // Open Graph tags
    { property: 'og:title', content: 'Free Online Image Resizer/Compression - High-Quality & Fast' },
    { property: 'og:description', content: 'Effortlessly compress and convert images for any platform with high quality.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://compresspictures.com' },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Free Online Image Resizer/Compression - High-Quality & Fast' },
    { name: 'twitter:description', content: 'Effortlessly compress and convert images for any platform with high quality.' }
  ]
})

// Theme state
const isDarkMode = ref(false)
const consentBannerRef = ref(null)
const isMobileMenuOpen = ref(false)

// Initialize theme based on user preference
onMounted(async () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = prefersDark
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  
  // Initialize consent banner with geolocation check
  if (consentBannerRef.value) {
    await consentBannerRef.value.checkAndShowBanner()
  }
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
          <a href="/" class="flex items-center">
            <img src="./assets/logo.png" alt="Logo" class="w-8 h-8 mr-2 filter dark:invert-0 invert grayscale dark:grayscale-0"> Compress <span class="text-green-600 dark:text-green-400">Pictures.com</span>
          </a>
        </h1>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Home
          </router-link>
          <a href="/#features" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Features
          </a>
          <a href="/#compression" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Compression
          </a>
          <a href="/#formats" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Formats
          </a>
          <a href="/#faq" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            FAQ
          </a>
          <router-link to="/about" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            About
          </router-link>
          <ThemeToggle :is-dark="isDarkMode" @toggle="toggleTheme" />
        </nav>
        
        <!-- Mobile Navigation -->
        <div class="md:hidden flex items-center">
          <ThemeToggle :is-dark="isDarkMode" @toggle="toggleTheme" class="mr-2" />
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-gray-600 dark:text-gray-300 focus:outline-none">
            <i class="fas" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
          </button>
        </div>
      </header>
      
      <!-- Mobile Menu Dropdown -->
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6 transition-all duration-300 ease-in-out">
        <nav class="flex flex-col space-y-3">
          <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2" @click="isMobileMenuOpen = false">
            Home
          </router-link>
          <a href="/#features" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2" @click="isMobileMenuOpen = false">
            Features
          </a>
          <a href="/#compression" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2" @click="isMobileMenuOpen = false">
            Compression
          </a>
          <a href="/#formats" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2" @click="isMobileMenuOpen = false">
            Formats
          </a>
          <a href="/#faq" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2" @click="isMobileMenuOpen = false">
            FAQ
          </a>
          <router-link to="/about" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2" @click="isMobileMenuOpen = false">
            About
          </router-link>
        </nav>
      </div>
      
      <!-- SEO Metadata -->
      <PageMeta />
      
      <!-- Main content -->
      <router-view v-slot="{ Component }">
        <component :is="Component" :isDarkMode="isDarkMode" @toggleTheme="toggleTheme" />
      </router-view>
    </div>
    
    <!-- GDPR Consent Banner -->
    <ConsentBanner ref="consentBannerRef" />
  </div>
</template>
