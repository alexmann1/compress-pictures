<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  originalImage: {
    type: Object,
    required: true
  },
  optimizedImage: {
    type: Object,
    default: null
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['reset', 'optimize']);

// Compression slider (higher = more compression, lower quality)
// Starting at 65% compression (minimum effective is 20%)
const compression = ref(65);

// Computed properties
const reduction = computed(() => {
  if (!props.optimizedImage) return 0;
  const diff = props.originalImage.size - props.optimizedImage.size;
  const percentage = (diff / props.originalImage.size) * 100;
  return Math.round(percentage);
});

// Format file size to human readable format
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Watch compression changes and emit optimize event with inverted quality value
watch(compression, (newCompression) => {
  // Convert compression to quality (100 - compression)
  // Map the 20-95% range to a more effective quality range
  const quality = 100 - newCompression;
  emit('optimize', quality);
}, { immediate: true });

// Handle reset button click
const handleReset = () => {
  compression.value = 65; // Reset to default compression (65%)
  emit('reset');
  // Also trigger optimization with the reset value
  emit('optimize', 100 - compression.value);
};
</script>

<template>
  <div class="p-4 bg-slate-200 dark:bg-gray-700 rounded-lg flex flex-col h-full">
    <!-- Image details -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">Image Details</h3>
      </div>

      <div class="space-y-2">
        <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
          <div class="flex justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Dimensions</p>
              <p class="text-base font-medium">{{ originalImage.width }} × {{ originalImage.height }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">File type</p>
              <p class="text-base font-medium">{{ originalImage.type.split('/')[1].toUpperCase() }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
          <div class="flex justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Original size</p>
              <p class="text-base font-medium">{{ formatSize(originalImage.size) }}</p>
            </div>
            <div v-if="optimizedImage">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Optimized size</p>
              <p class="text-base font-medium">{{ formatSize(optimizedImage.size) }}</p>
            </div>
          </div>
        </div>
        
        <div v-if="optimizedImage" class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Size reduction</p>
          <p class="text-base font-medium" :class="reduction > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'">
            <i :class="[reduction > 0 ? 'fas fa-check-circle' : 'fas fa-exclamation-circle', 'mr-1']"></i> 
            {{ formatSize(Math.abs(originalImage.size - optimizedImage.size)) }} {{ reduction > 0 ? 'saved' : 'saved' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quality slider -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-2">Settings</h3>
      
      <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
        <div class="flex justify-between items-center mb-2">
          <label for="compression" class="text-gray-600 dark:text-gray-400 text-sm font-medium">Compression/Quality:</label>
          <span class="text-green-600 dark:text-green-400 font-medium">{{ reduction }}%</span>
        </div>
        <input 
          type="range" 
          id="compression" 
          v-model="compression" 
          min="20" 
          max="95" 
          step="5"
          class="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider-green"
        >
      </div>
    </div>

    <!-- Spacer to push download button to bottom -->
    <div class="flex-grow"></div>
    
    <!-- Actions -->
    <div class="flex flex-col space-y-3 mt-auto">       
      <a 
        v-if="optimizedImage" 
        :href="optimizedImage.url" 
        :download="`optimized-${originalImage.name}`"
        class="w-full px-4 py-3 bg-green-800 text-white hover:bg-green-700 rounded-lg transition-colors text-center font-medium"
      >
        <i class="fas fa-download mr-2"></i> Download
      </a>
    </div>
  </div>

</template>

<style scoped>
/* Green slider thumb styling */
.slider-green::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background-color: #10B981; /* Tailwind green-500 */
  border-radius: 50%;
  cursor: pointer;
}

.slider-green::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background-color: #10B981; /* Tailwind green-500 */
  border-radius: 50%;
  border: none;
  cursor: pointer;
}

/* Dark mode support */
.dark .slider-green::-webkit-slider-thumb {
  background-color: #34D399; /* Tailwind green-400 for dark mode */
}

.dark .slider-green::-moz-range-thumb {
  background-color: #34D399; /* Tailwind green-400 for dark mode */
}
</style>
