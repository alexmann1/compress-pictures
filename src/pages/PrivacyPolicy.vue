<template>
  <PageMeta 
    title="Privacy Policy - CompressPictures.com"
    description="Privacy Policy for CompressPictures.com - Learn how we handle your data and protect your privacy."
    keywords="privacy policy, data protection, image optimizer privacy, user data, cookies policy"
  />  
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'dark' : 'light'">
    <div class="w-full px-0">
      <!-- Header with theme toggle and back button -->
      <header class="mb-6">
        <div class="text-right">
          <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 mr-4">
            <i class="fas fa-arrow-left mr-2"></i> Back to Home
          </router-link>
        </div>
      </header>

      <!-- Main content -->
      <main class="max-w-4xl mx-auto pb-8 px-4 md:px-0">
        <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Privacy Policy</h1>
        
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <p class="mb-6">
            <strong>Last Updated: {{ new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</strong>
          </p>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Introduction</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              At CompressPictures.com, we take your privacy seriously. This Privacy Policy explains how our image optimization tool works and how we handle your data (or more accurately, how we don't handle your data).
            </p>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Our service is designed with privacy as a core principle. We've built our tool to process all images directly in your browser, meaning your images never leave your device.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Client-Side Processing</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              When you use CompressPictures.com:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2">Your images are processed entirely within your web browser</li>
              <li class="mb-2">Your images are never uploaded to our servers</li>
              <li class="mb-2">We never see, store, or have access to your images</li>
              <li class="mb-2">No image data is transmitted over the internet</li>
            </ul>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              This approach ensures complete privacy and security for your images, making our tool suitable even for sensitive or confidential images.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Information We Collect</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              We collect minimal information:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2">
                <strong>Anonymous Usage Data:</strong> We may collect anonymous usage statistics (such as page views and feature usage) to help us improve our service. This data cannot be used to identify you.
              </li>
              <li class="mb-2">
                <strong>Cookies:</strong> We use only essential cookies to remember your preferences (like dark mode setting). We do not use tracking or advertising cookies.
              </li>
            </ul>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Third-Party Services</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Our website may use the following third-party services:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2">
                <strong>Analytics:</strong> We may use basic analytics to understand how users interact with our site. This data is anonymized and cannot be used to identify individual users. <a href="https://policies.google.com/technologies/partner-sites" target="_blank" class="text-blue-500 dark:text-blue-400 hover:underline">Learn how Google collects and uses data</a>
              </li>
              <li class="mb-2">
                <strong>Content Delivery Networks (CDNs):</strong> We may use CDNs to deliver static content like JavaScript libraries more efficiently.
              </li>
            </ul>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              These services do not have access to your images or personal information.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Your Rights</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Since we don't collect personal data, there's very little for you to manage. However, you can:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2">Clear your browser cookies to remove any saved preferences</li>
              <li class="mb-2">Use your browser's private/incognito mode to prevent any data from being stored</li>
            </ul>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Changes to This Policy</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageMeta from '../components/PageMeta.vue'
import Footer from '../components/Footer.vue'

// Theme state
const isDarkMode = ref(false)

// Initialize theme based on user preference
onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = prefersDark
})

// Toggle theme
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
}
</script>
