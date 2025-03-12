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

// Apply the metadata
useHead({
  title: fullTitle,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: author },
    // Add Open Graph tags for better social media sharing
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://compresspictures.com' },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description }
  ]
})
</script>

<template>
  <!-- This is an invisible component that only affects the document head -->
</template>
