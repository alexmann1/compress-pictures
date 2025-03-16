<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-if="showBanner"
        class="fixed bottom-0 left-0 w-full p-4 bg-white dark:bg-gray-800 shadow-md z-50 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-start">
            <i class="fas fa-cookie-bite text-blue-500 dark:text-blue-400 text-xl mr-3 mt-1"></i>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">Cookie Consent</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                We use cookies to improve your experience and for analytics. You can customize your cookie preferences.
                See our <router-link to="/privacy" class="text-blue-500 hover:underline">Privacy Policy</router-link> for more details.
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <button
              @click="acceptAllCookies"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-check mr-2"></i>Accept All
            </button>
            <button
              @click="acceptEssentialCookies"
              class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <i class="fas fa-cookie mr-2"></i>Essential Only
            </button>
            <button
              @click="showCustomizeOptions = !showCustomizeOptions"
              class="px-4 py-2 bg-transparent text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <i class="fas fa-cog mr-2"></i>Customize
            </button>
          </div>
        </div>

        <!-- Customization Panel -->
        <div
          v-if="showCustomizeOptions"
          class="container mx-auto mt-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-md"
        >
          <h4 class="font-bold mb-3 text-gray-900 dark:text-white">Cookie Preferences</h4>
          <div class="space-y-3">
            <div class="flex items-center">
              <input
                id="essential-cookies"
                type="checkbox"
                checked
                disabled
                class="mr-2 h-4 w-4 text-blue-600"
              />
              <label for="essential-cookies" class="text-gray-700 dark:text-gray-300">
                Essential Cookies (Required)
                <span class="block text-xs text-gray-500 dark:text-gray-400">
                  These cookies are necessary for the website to function properly.
                </span>
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="analytics-cookies"
                v-model="cookiePreferences.analytics"
                type="checkbox"
                class="mr-2 h-4 w-4 text-blue-600"
              />
              <label for="analytics-cookies" class="text-gray-700 dark:text-gray-300">
                Analytics Cookies
                <span class="block text-xs text-gray-500 dark:text-gray-400">
                  Help us improve our website by collecting and reporting anonymous usage information.
                </span>
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="functional-cookies"
                v-model="cookiePreferences.functional"
                type="checkbox"
                class="mr-2 h-4 w-4 text-blue-600"
              />
              <label for="functional-cookies" class="text-gray-700 dark:text-gray-300">
                Functional Cookies
                <span class="block text-xs text-gray-500 dark:text-gray-400">
                  Enable enhanced functionality and personalization.
                </span>
              </label>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <button
              @click="saveCustomPreferences"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-save mr-2"></i>Save Preferences
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// State
const showBanner = ref(false);
const showCustomizeOptions = ref(false);
const cookiePreferences = ref({
  essential: true, // Always required
  analytics: false,
  functional: false
});

// Check if consent has been given before
onMounted(() => {
  const savedConsent = localStorage.getItem('cookie-consent');
  if (!savedConsent) {
    // No consent saved, show the banner
    showBanner.value = true;
  } else {
    // Consent was given before, parse preferences
    try {
      const savedPreferences = JSON.parse(savedConsent);
      cookiePreferences.value = {
        ...cookiePreferences.value,
        ...savedPreferences
      };
      
      // Apply consent to Google's consent mode if available
      applyGoogleConsentMode(cookiePreferences.value);
    } catch (e) {
      console.error('Error parsing saved consent:', e);
      showBanner.value = true;
    }
  }
});

// Methods
const saveConsent = (preferences) => {
  localStorage.setItem('cookie-consent', JSON.stringify(preferences));
  showBanner.value = false;
  showCustomizeOptions.value = false;
  
  // Apply consent to Google's consent mode
  applyGoogleConsentMode(preferences);
};

const acceptAllCookies = () => {
  const allAccepted = {
    essential: true,
    analytics: true,
    functional: true
  };
  cookiePreferences.value = allAccepted;
  saveConsent(allAccepted);
};

const acceptEssentialCookies = () => {
  const essentialOnly = {
    essential: true,
    analytics: false,
    functional: false
  };
  cookiePreferences.value = essentialOnly;
  saveConsent(essentialOnly);
};

const saveCustomPreferences = () => {
  saveConsent({
    essential: true, // Always required
    analytics: cookiePreferences.value.analytics,
    functional: cookiePreferences.value.functional
  });
};

// Google consent mode integration
const applyGoogleConsentMode = (preferences) => {
  // Check if window and gtag are available (client-side only)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      'analytics_storage': preferences.analytics ? 'granted' : 'denied',
      'functionality_storage': preferences.functional ? 'granted' : 'denied',
      'ad_storage': 'denied', // We don't have advertising cookies in our preferences, so default to denied
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
  }
};

// Expose methods for parent components
defineExpose({
  showConsentBanner: () => {
    showBanner.value = true;
  },
  hideConsentBanner: () => {
    showBanner.value = false;
  },
  resetConsent: () => {
    localStorage.removeItem('cookie-consent');
    showBanner.value = true;
    cookiePreferences.value = {
      essential: true,
      analytics: false,
      functional: false
    };
  }
});
</script>
