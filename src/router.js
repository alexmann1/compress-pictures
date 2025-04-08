import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import PrivacyPolicy from './pages/PrivacyPolicy.vue'
import TermsOfService from './pages/TermsOfService.vue'
import About from './pages/About.vue'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'CompressPictures.com - Free Online Image Resizer/Compression',
      description: 'Optimize your images for social media with fast compression and format conversion.',
      keywords: 'image optimizer, image compression, image converter, compress jpeg, compress png, compress webp, compress gif, compress svg, free image tool, online image compression',
      author: 'CompressPictures.com',
      ogUrl: 'https://compresspictures.com',
      ogImage: 'https://compresspictures.com/logo.png'
    }
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: {
      title: 'Privacy Policy - CompressPictures.com',
      description: 'Privacy Policy for CompressPictures.com - Learn how we handle your data and protect your privacy.',
      keywords: 'privacy policy, data protection, image optimizer privacy, user data, cookies policy',
      author: 'CompressPictures.com',
      ogUrl: 'https://compresspictures.com/privacy',
      ogImage: 'https://compresspictures.com/logo.png'
    }
  },
  {
    path: '/terms',
    name: 'TermsOfService',
    component: TermsOfService,
    meta: {
      title: 'Terms of Service - CompressPictures.com',
      description: 'Terms of Service for CompressPictures.com - Understand the rules and conditions for using our image optimization services.',
      keywords: 'terms of service, terms and conditions, user agreement, service terms, legal terms',
      author: 'CompressPictures.com',
      ogUrl: 'https://compresspictures.com/terms',
      ogImage: 'https://compresspictures.com/logo.png'
    }
  },
  {
    path: '/faq',
    redirect: '/#faq',
    meta: {
      title: 'FAQ - CompressPictures.com',
      description: 'Frequently Asked Questions about our image optimization services.',
      keywords: 'image optimizer faq, compress pictures help, image compression questions, frequently asked questions',
      author: 'CompressPictures.com',
      ogUrl: 'https://compresspictures.com/#faq',
      ogImage: 'https://compresspictures.com/logo.png'
    }
  },
  {
    path: '/features',
    redirect: '/#features',
    meta: {
      title: 'Features - CompressPictures.com',
      description: 'Explore the features of our free image optimization service.',
      keywords: 'image optimizer features, compress pictures features, image compression options, free image tools',
      author: 'CompressPictures.com',
      ogUrl: 'https://compresspictures.com/#features',
      ogImage: 'https://compresspictures.com/logo.png'
    }
  },
  {
    path: '/compression',
    redirect: '/#compression',
    meta: {
      title: 'Compression - CompressPictures.com',
      description: 'Understanding Image Compression',
      keywords: 'image optimizer compression, compress pictures compression, image compression options, free image tools',
      author: 'CompressPictures.com',
      ogUrl: 'https://compresspictures.com/#compression',
      ogImage: 'https://compresspictures.com/logo.png'
    }
  },  
  {
    path: '/formats',
    redirect: '/#formats',
    meta: {
      title: 'Formats - CompressPictures.com',
      description: 'Understanding different image formats and when to use them',
      keywords: 'image optimizer formats, compress pictures formats, image formats options, free image tools',
      author: 'CompressPictures.com',
      ogUrl: 'https://compresspictures.com/#formats',
      ogImage: 'https://compresspictures.com/logo.png'
    }
  },    
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'About Us - CompressPictures.com',
      description: 'Learn about the team behind CompressPictures.com and our mission to provide free, privacy-focused image optimization tools.',
      keywords: 'about us, image optimization team, company information, contact us, free image tools',
      author: 'CompressPictures.com',
      ogUrl: 'https://compresspictures.com/about',
      ogImage: 'https://compresspictures.com/logo.png'
    }
  }
]

export function createRouterInstance() {
  return createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      // For browser back/forward navigation
      if (savedPosition) {
        return savedPosition;
      }
      
      // For hash navigation (anchors)
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
          top: 70, // Add some offset for the header
        };
      }
      
      // If it's a different page (not just a query param change)
      if (from.path !== to.path) {
        return { 
          left: 0,
          top: 0,
          behavior: 'auto' // Using 'auto' instead of 'smooth' for page transitions
        };
      }
      
      // Default scroll position
      return { top: 0 };
    }
  })
}