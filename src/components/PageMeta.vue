<script setup>
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Get the current route
const route = useRoute()

// Use route metadata or fallback to default values
const title = computed(() => route.meta.title || 'CompressPictures.com')
const description = computed(() => route.meta.description || '')
const keywords = computed(() => route.meta.keywords || '')
const author = computed(() => route.meta.author || 'CompressPictures.com')

// Compute the full title with site name if not already included
const fullTitle = computed(() => {
  return title.value.includes('CompressPictures.com') 
    ? title.value 
    : `${title.value} | CompressPictures.com`
})

// Get the current canonical URL
const canonicalUrl = computed(() => {
  const path = route.path === '/' ? '' : route.path
  return `https://compresspictures.com${path}`
})

// Apply the metadata
useHead({
  // Basic meta tags
  title: fullTitle,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: author },
    
    // Open Graph tags for better social media sharing
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: 'https://compresspictures.com/logo.png' },
    { property: 'og:site_name', content: 'CompressPictures.com' },
    
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: 'https://compresspictures.com/logo.png' },
    
    // Additional SEO meta tags
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
  ],
  link: [
    // Canonical URL to avoid duplicate content issues
    { rel: 'canonical', href: canonicalUrl }
  ]
})
</script>

<template>
  <!-- This component doesn't render anything in the DOM -->
</template>
