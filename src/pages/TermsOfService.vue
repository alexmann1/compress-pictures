<template>
  <PageMeta />  
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'dark' : 'light'">
    <div class="w-full px-4 md:px-6">
      <!-- Header with theme toggle and back button -->
      <header class="mb-6"><!--
        <div class="text-right">
          <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 mr-4">
            <i class="fas fa-arrow-left mr-2"></i> Back to Home
          </router-link>
        </div>-->
      </header>

      <!-- Main content -->
      <main class="max-w-4xl mx-auto py-8 px-4 md:px-0">
        <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Terms of Service</h1>
        
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <p class="mb-6">
            <strong>Last Updated: {{ new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</strong>
          </p>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">1. Acceptance of Terms</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              By accessing or using CompressPictures.com ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">2. Description of Service</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              CompressPictures.com provides a free online tool for optimizing images through compression, format conversion, and resizing. All processing is performed client-side within your browser.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">3. Use of the Service</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2">Use the Service in any way that could disable, overburden, damage, or impair the site</li>
              <li class="mb-2">Attempt to gain unauthorized access to any parts of the Service</li>
              <li class="mb-2">Use any robot, spider, or other automated means to access the Service</li>
              <li class="mb-2">Introduce any viruses, Trojan horses, worms, or other malicious code</li>
            </ul>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">4. Intellectual Property</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              The Service and its original content, features, and functionality are owned by CompressPictures.com and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              We claim no ownership rights over the images you process using our Service. You retain all ownership and rights to your images.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">5. User Content</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Our Service processes images entirely within your browser. We do not:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2">Store your images on our servers</li>
              <li class="mb-2">Access your images</li>
              <li class="mb-2">Transmit your images over the internet</li>
            </ul>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              You are solely responsible for the images you process using our Service and must ensure you have the legal right to use and modify those images.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">6. Disclaimer of Warranties</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              We do not guarantee that:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2">The Service will always be available or uninterrupted</li>
              <li class="mb-2">The results of using the Service will meet your requirements</li>
              <li class="mb-2">The quality of compressed or converted images will meet your expectations</li>
            </ul>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">7. Limitation of Liability</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              In no event shall CompressPictures.com, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
              <li class="mb-2">Your access to or use of or inability to access or use the Service</li>
              <li class="mb-2">Any conduct or content of any third party on the Service</li>
              <li class="mb-2">Any content obtained from the Service</li>
              <li class="mb-2">Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">8. Changes to Terms</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "Last Updated" date.
            </p>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">9. Contact Us</h2>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              If you have any questions about these Terms, please contact us at mncn.labs@gmail.com
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
