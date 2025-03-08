<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 0
  }
})

// Format size for display (KB, MB)
const formattedSize = computed(() => {
  if (props.size < 1024) {
    return `${props.size} B`
  } else if (props.size < 1024 * 1024) {
    return `${(props.size / 1024).toFixed(2)} KB`
  } else {
    return `${(props.size / (1024 * 1024)).toFixed(2)} MB`
  }
})
</script>

<template>
  <div class="image-preview bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
    <div class="relative">
      <img 
        :src="src" 
        alt="Preview" 
        class="w-full h-auto object-contain max-h-96"
      />
      <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {{ formattedSize }}
      </div>
    </div>
  </div>
</template>
