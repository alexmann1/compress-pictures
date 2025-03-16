import { ViteSSG } from 'vite-ssg'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import { routes } from './router'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  { routes },
  // function to have custom setups
  ({ app, router, head, isClient }) => {
    // Create head management for SEO and set it up before the app is mounted
    const headInstance = createHead()
    app.use(headInstance)
    
    // Initialize Google Analytics with Consent Mode v2 (client-side only)
    if (isClient) {
      // Setup Google Consent Mode v2 - must be defined before loading the Google tag
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      
      // Set default consent state to 'denied' until user provides consent
      gtag('consent', 'default', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'functionality_storage': 'denied',
        'security_storage': 'granted', // Security cookies are always allowed
        'wait_for_update': 2000 // Wait for consent banner interaction
      });
      
      // Load Google Analytics script
      const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA ID
      
      // Create and load Google Analytics script
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(gaScript);
      
      // Initialize Google Analytics
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
      });
    }
    
    // Apply route meta tags during SSG (if not client)
    if (!isClient) {
      // SSG hook to ensure each route gets its correct metadata
      router.beforeEach((to, from, next) => {
        const metaData = to.meta || {}
        
        // Set page-specific metadata
        headInstance.addHeadObjs({
          title: metaData.title || 'CompressPictures.com',
          meta: [
            { name: 'description', content: metaData.description || '' },
            { name: 'keywords', content: metaData.keywords || '' },
            { name: 'author', content: metaData.author || 'CompressPictures.com' },
            
            // Open Graph tags
            { property: 'og:title', content: metaData.title || 'CompressPictures.com' },
            { property: 'og:description', content: metaData.description || '' },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: metaData.ogUrl || `https://compresspictures.com${to.path}` },
            { property: 'og:image', content: metaData.ogImage || 'https://compresspictures.com/logo.png' },
            { property: 'og:site_name', content: 'CompressPictures.com' },
            
            // Twitter Card tags
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:title', content: metaData.title || 'CompressPictures.com' },
            { name: 'twitter:description', content: metaData.description || '' },
            { name: 'twitter:image', content: metaData.ogImage || 'https://compresspictures.com/logo.png' },
            
            // Additional SEO meta tags
            { name: 'robots', content: 'index, follow' },
            { name: 'googlebot', content: 'index, follow' },
          ],
          link: [
            // Canonical URL to avoid duplicate content issues
            { rel: 'canonical', href: metaData.ogUrl || `https://compresspictures.com${to.path}` }
          ]
        })
        
        next()
      })
    }
  }
)