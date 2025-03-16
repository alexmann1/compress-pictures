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

// Banner visibility state
const showBanner = ref(false);
const showCustomizeOptions = ref(false);
const cookiePreferences = ref({
  essential: true, // Always required
  analytics: false,
  functional: false
});

// List of regions where GDPR or similar laws apply
const gdprRegions = [
  // EU countries
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // EEA countries (non-EU)
  'IS', 'LI', 'NO',
  // UK (separate from EU after Brexit)
  'GB',
  // Other countries with similar laws
  'BR', // Brazil (LGPD)
  'CH', // Switzerland
  'CA' // Canada (PIPEDA)
];

// US states with privacy laws
const privacyLawStates = [
  'California', // CCPA
  'Colorado',
  'Connecticut',
  'Utah',
  'Virginia'
];

// Check if user is in a region requiring consent
const checkIfConsentRequired = async () => {
  try {
    // Use browser language/locale to determine region
    const browserLang = navigator.language || navigator.userLanguage || '';
    const langCode = browserLang.split('-')[0].toUpperCase();
    const countryCode = browserLang.includes('-') ? browserLang.split('-')[1].toUpperCase() : langCode;
    
    // Check if language suggests EU region
    const euLanguages = ['DE', 'FR', 'IT', 'ES', 'PT', 'NL', 'DA', 'SV', 'FI', 'EL', 'CS', 'ET', 'HU', 'LV', 'LT', 'MT', 'PL', 'SK', 'SL'];
    const isEuLanguage = euLanguages.includes(langCode);
    
    // Check if country code is in GDPR regions
    const isGdprRegion = gdprRegions.includes(countryCode);
    
    // Check for US and try to determine state from timezone
    const isUS = countryCode === 'US' || browserLang.includes('en-US');
    let isPrivacyLawState = false;
    
    if (isUS) {
      // Check timezone for US states with privacy laws
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      isPrivacyLawState = timeZone.includes('Los_Angeles') || // California
                          timeZone.includes('Denver') ||      // Colorado 
                          timeZone.includes('New_York');      // Connecticut
    }
    
    // If we can determine the user is NOT in a regulated region, return false
    // Otherwise default to true for safety
    if (!isEuLanguage && !isGdprRegion && !isPrivacyLawState && !isUS) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error determining user region:', error);
    // Default to showing the banner if we can't determine location
    return true;
  }
};

// Initialize Google Consent Mode v2
const initializeGoogleConsentMode = () => {
  // Set up Google's consent mode v2 - must run before Google Tag/Analytics loads
  if (window.gtag) {
    // Already initialized
    return;
  }
  
  // Define dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  
  // Set default consent to 'denied' for regulated regions
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'functionality_storage': 'denied',
    'security_storage': 'granted', // Security cookies are always allowed
    'wait_for_update': 500 // Wait for consent banner interaction
  });
};

// Apply consent settings to Google's consent mode
const applyGoogleConsentMode = (preferences) => {
  if (window.gtag) {
    window.gtag('consent', 'update', {
      'analytics_storage': preferences.analytics ? 'granted' : 'denied',
      'functionality_storage': preferences.functional ? 'granted' : 'denied',
      'ad_storage': 'denied', // We don't use ad cookies, so always deny
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'security_storage': 'granted' // Security cookies are always allowed
    });
  }
};

// Check for existing consent and initialize Google Consent Mode
onMounted(async () => {
  // Initialize Google Consent Mode regardless of region
  initializeGoogleConsentMode();
  
  const hasConsent = localStorage.getItem('cookie-consent');
  
  if (!hasConsent) {
    const consentRequired = await checkIfConsentRequired();
    
    if (consentRequired) {
      // Don't show banner immediately, parent component will call checkAndShowBanner
    } else {
      // For users in non-regulated regions, set default consent
      saveConsent({
        essential: true,
        analytics: true,
        functional: true
      });
    }
  } else {
    // If consent exists, apply it to Google Consent Mode
    try {
      const savedPreferences = JSON.parse(hasConsent);
      cookiePreferences.value = {
        ...cookiePreferences.value,
        ...savedPreferences
      };
      
      // Apply existing consent to Google's consent mode
      applyGoogleConsentMode(cookiePreferences.value);
    } catch (e) {
      console.error('Error parsing saved consent:', e);
    }
  }
});

// Save consent to localStorage
const saveConsent = (preferences) => {
  const consentData = {
    ...preferences,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('cookie-consent', JSON.stringify(consentData));
  
  // Apply consent settings to Google Analytics
  applyGoogleConsentMode(preferences);
  
  // Hide banner after saving
  showBanner.value = false;
};

// Accept all cookies
const acceptAllCookies = () => {
  saveConsent({
    essential: true,
    analytics: true,
    functional: true
  });
};

// Accept only essential cookies
const acceptEssentialCookies = () => {
  saveConsent({
    essential: true,
    analytics: false,
    functional: false
  });
};

// Save custom preferences
const saveCustomPreferences = () => {
  saveConsent({
    essential: true, // Always required
    analytics: cookiePreferences.value.analytics,
    functional: cookiePreferences.value.functional
  });
};

// Expose methods for parent components
defineExpose({
  showConsentBanner() {
    showBanner.value = true;
  },
  hideConsentBanner() {
    showBanner.value = false;
  },
  async checkAndShowBanner() {
    const hasConsent = localStorage.getItem('cookie-consent');
    
    if (!hasConsent) {
      const consentRequired = await checkIfConsentRequired();
      
      if (consentRequired) {
        // Show banner after a short delay
        setTimeout(() => {
          showBanner.value = true;
        }, 1000);
      } else {
        // For users in non-regulated regions, set default consent
        saveConsent({
          essential: true,
          analytics: true,
          functional: true
        });
      }
    }
    
    return !!hasConsent;
  },
  resetConsent() {
    localStorage.removeItem('cookie-consent');
    cookiePreferences.value = {
      essential: true,
      analytics: false,
      functional: false
    };
    showBanner.value = true;
  }
});
</script>
