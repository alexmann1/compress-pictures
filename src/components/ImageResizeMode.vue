<template>
  <div class="resize-mode h-full">
    <div class="relative w-full h-full overflow-hidden rounded-lg bg-slate-200 dark:bg-gray-700 min-h-[650px]">
      <ImageCompare 
        :original-src="originalImage?.url || ''" 
        :optimized-src="optimizedImage?.url || ''" 
        :slider-position="sliderPosition"
        :is-processing="!optimizedImage"
        @slider-updated="updateSliderPosition"
        @slider-drag="handleSliderDrag"
      />
      
      <div v-if="!optimizedImage" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center p-8 rounded-lg bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90">
          <i class="fas fa-cog fa-spin text-4xl mb-4"></i>
          <p class="text-lg font-medium">Optimizing image...</p>
        </div>
      </div>
      
      <div v-if="optimizedImage" class="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div class="text-xs uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400">Size reduction</div>
          <div class="font-bold">{{ reduction }}%</div>
        </div>
        <div>
          <div class="text-xs uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400">Original</div>
          <div class="font-medium">{{ formatSize(originalImage?.size) }}</div>
        </div>
        <div>
          <div class="text-xs uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400">Optimized</div>
          <div class="font-medium">{{ formatSize(optimizedImage?.size) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ImageCompare from './ImageCompare.vue';

const props = defineProps({
  originalImage: Object,
  optimizedImage: Object,
  sliderPosition: Number
});

const emit = defineEmits(['update-slider', 'slider-drag']);

// Calculate size reduction
const reduction = computed(() => {
  if (props.originalImage && props.optimizedImage) {
    const originalSize = props.originalImage.size;
    const optimizedSize = props.optimizedImage.size;
    const reductionValue = ((originalSize - optimizedSize) / originalSize) * 100;
    return reductionValue.toFixed(1);
  }
  return '0';
});

// Format size for display (KB, MB)
const formatSize = (bytes) => {
  if (!bytes) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};

// Update slider position
const updateSliderPosition = (position) => {
  emit('update-slider', position);
};

// Slider drag handler
const handleSliderDrag = (e) => {
  emit('slider-drag', e);
};
</script>
