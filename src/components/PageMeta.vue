<script setup>
import { useHead } from '@vueuse/head'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  keywords: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'CompressPictures.com'
  }
})

// Compute the full title with site name
const fullTitle = computed(() => {
  return props.title ? `${props.title} | CompressPictures.com` : 'CompressPictures.com'
})

// Apply the metadata
useHead({
  title: fullTitle,
  meta: [
    { name: 'description', content: props.description },
    { name: 'keywords', content: props.keywords },
    { name: 'author', content: props.author }
  ]
})
</script>

<template>
  <!-- This is an invisible component that only affects the document head -->
</template>
