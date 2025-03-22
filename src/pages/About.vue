<template>
  <PageMeta />  
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'dark' : 'light'">
    <div class="w-full px-4 md:px-6">
      <!-- Header with back button -->
      <header class="mb-6">
        <!--
        <div class="text-right">
          <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 mr-4">
            <i class="fas fa-arrow-left mr-2"></i> Back to Home
          </router-link>
        </div>-->
      </header>

      <!-- Main content -->
      <main class="max-w-4xl mx-auto py-8 px-4 md:px-0">
        <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">About Us</h1>
        
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Our Mission</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              At CompressPictures.com, our mission is to provide a free, accessible, and privacy-focused image optimization tool that helps everyone reduce image file sizes without sacrificing quality.
            </p>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              We believe that image optimization should be simple, secure, and available to everyone without requiring technical expertise or expensive software.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Who We Are</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              CompressPictures.com was created by a team of web developers and designers who were frustrated by the lack of simple, browser-based image optimization tools that respect user privacy.
            </p>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Founded in 2023, our team is dedicated to continuously improving our tool based on user feedback and the latest web technologies.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Our Approach</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              What makes our service unique:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2"><strong>100% Client-Side Processing:</strong> Your images never leave your device. All optimization happens directly in your browser.</li>
              <li class="mb-2"><strong>Privacy-First:</strong> We don't see, store, or have access to your images.</li>
              <li class="mb-2"><strong>No Registration Required:</strong> Use our tool immediately without creating an account or providing personal information.</li>
              <li class="mb-2"><strong>Free to Use:</strong> Our core optimization features are completely free.</li>
            </ul>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Contact Us</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              We value your feedback and are always looking for ways to improve our service. If you have questions, suggestions, or encounter any issues, please don't hesitate to contact us.
            </p>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Email: <a href="mailto:mncn.labs@gmail.com" class="text-blue-500 dark:text-blue-400 hover:underline">mncn.labs@gmail.com</a>
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Why Optimize Images?</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Image optimization offers numerous benefits:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2"><strong>Faster Websites:</strong> Optimized images load quicker, improving user experience and SEO rankings.</li>
              <li class="mb-2"><strong>Reduced Bandwidth:</strong> Smaller file sizes mean less data usage, which is especially important for mobile users.</li>
              <li class="mb-2"><strong>Lower Storage Needs:</strong> Optimize your photo library to save valuable storage space on your devices.</li>
              <li class="mb-2"><strong>Improved Email Deliverability:</strong> Email attachments with optimized images are less likely to be blocked.</li>
            </ul>
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
  
  // Scroll to top when component is mounted
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  })
})

// Toggle theme
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
}
</script>
