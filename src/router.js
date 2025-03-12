import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import PrivacyPolicy from './pages/PrivacyPolicy.vue'
import TermsOfService from './pages/TermsOfService.vue'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Free Online Image Resizer/Compression - High-Quality & Fast',
      description: 'Instantly reduce your image file size, effortlessly adapt them for any social media platform, and quickly convert between image formats.',
      keywords: 'image optimizer, image compression, image converter, compress jpeg, compress png, compress webp, compress gif, compress svg, free image tool, online image compression',
      author: 'CompressPictures.com'
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
      author: 'CompressPictures.com'
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
      author: 'CompressPictures.com'
    }
  },
  {
    path: '/faq',
    redirect: '/#faq',
    meta: {
      title: 'FAQ - CompressPictures.com',
      description: 'Frequently Asked Questions about our image optimization services.',
      keywords: 'image optimizer faq, compress pictures help, image compression questions, frequently asked questions',
      author: 'CompressPictures.com'
    }
  },
  {
    path: '/features',
    redirect: '/#features',
    meta: {
      title: 'Features - CompressPictures.com',
      description: 'Explore the features of our free image optimization service.',
      keywords: 'image optimizer features, compress pictures features, image compression options, free image tools',
      author: 'CompressPictures.com'
    }
  }  
]

export function createRouterInstance() {
  return createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
      return { top: 0 }
    }
  })
}