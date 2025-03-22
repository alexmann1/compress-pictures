<template>
  <div 
    v-if="showBanner" 
    class="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 md:px-6 z-50 shadow-lg"
  >
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <p class="mb-2 md:mb-0">
          We use cookies to enhance your experience and analyze site usage. By clicking "Accept", you consent to the use of cookies.
          <router-link to="/privacy" class="text-blue-400 hover:underline ml-1">Privacy Policy</router-link>
        </p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="acceptCookies" 
          class="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 px-4 py-2 rounded-md whitespace-nowrap"
        >
          Accept
        </button>
        <button 
          @click="rejectCookies" 
          class="bg-gray-600 hover:bg-gray-700 transition-colors duration-200 px-4 py-2 rounded-md whitespace-nowrap"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showBanner = ref(false);

// Check if consent has already been given
onMounted(() => {
  const cookieConsent = localStorage.getItem('cookie-consent');
  if (cookieConsent === null) {
    // Only show banner if consent has not been given yet
    showBanner.value = true;
  }
});

// Accept cookies
const acceptCookies = () => {
  localStorage.setItem('cookie-consent', 'accepted');
  showBanner.value = false;
};

// Reject cookies
const rejectCookies = () => {
  localStorage.setItem('cookie-consent', 'rejected');
  showBanner.value = false;
};
</script>
