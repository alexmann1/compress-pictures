<script setup>
import { ref, computed, watch } from 'vue';
import FeatureTabs from './FeatureTabs.vue';

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
  },
  cropImage: {
    type: Function,
    default: null
  },
  activeTab: {
    type: String,
    default: 'resize'
  },
  formatState: {
    type: Object,
    default: () => ({
      platform: 'instagram',
      ratio: '1:1',
      position: { x: 0, y: 0 }
    })
  }
});

const emit = defineEmits(['reset', 'optimize', 'format', 'tab-change']);

// Use active tab from props
const activeTab = computed(() => props.activeTab || 'resize');

// Compression slider (higher = more compression, lower quality)
// Starting at 65% compression (minimum effective is 20%)
const compression = ref(65);

// Format options with ratio labels and resolutions
const formatOptions = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: 'fab fa-instagram',
    ratios: [
      { ratio: '1:1', label: 'Square', resolution: '1080×1080' },
      { ratio: '9:16', label: 'Story', resolution: '1080×1920' },
      { ratio: '4:5', label: 'Portrait', resolution: '1080×1350' }
    ]
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: 'fab fa-facebook-f',
    ratios: [
      { ratio: '1.91:1', label: 'Post', resolution: '1200×628' },
      /*{ ratio: '1:1', label: 'Square', resolution: '1080×1080' },
      { ratio: '16:9', label: 'Landscape', resolution: '1280×720' },
      { ratio: '4:5', label: 'Portrait', resolution: '1080×1350' }*/
    ]
  },
  { 
    id: 'x', 
    name: 'X', 
    icon: 'fab fa-x-twitter',
    ratios: [
      { ratio: '16:9', label: 'Post', resolution: '1200×675' },
      { ratio: '1:1', label: 'Square', resolution: '1080×1080' }
    ]
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: 'fab fa-linkedin-in',
    ratios: [
      { ratio: '1:1', label: 'Square', resolution: '1080×1080' },
      { ratio: '16:9', label: 'Landscape', resolution: '1920×1080' }
    ]
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: 'fab fa-youtube',
    ratios: [
      { ratio: '16:9', label: 'Thumbnail', resolution: '1280×720' }
    ]
  },
  { 
    id: 'pinterest', 
    name: 'Pinterest', 
    icon: 'fab fa-pinterest-p',
    ratios: [
    { ratio: '9:16', label: 'Pin', resolution: '1080×1920' },
    { ratio: '1:1', label: 'Square', resolution: '1080×1080' },
    ]
  }
];

// Format options - use refs derived from formatState
const selectedFormat = ref(props.formatState?.platform || 'instagram');
const aspectRatio = ref(props.formatState?.ratio || formatOptions[0].ratios[0].ratio);

// Watch for external changes to formatState
watch(() => props.formatState, (newState) => {
  if (newState) {
    selectedFormat.value = newState.platform;
    aspectRatio.value = newState.ratio;
  }
}, { deep: true });

// Watch for format changes initiated in this component
watch([selectedFormat], () => {
  // When platform changes, select first ratio of that platform if current ratio isn't available
  const platform = formatOptions.find(opt => opt.id === selectedFormat.value);
  const availableRatios = platform.ratios.map(r => r.ratio);
  
  if (!availableRatios.includes(aspectRatio.value)) {
    aspectRatio.value = availableRatios[0];
  }
  
  emit('format', { platform: selectedFormat.value, ratio: aspectRatio.value });
});

// Watch for aspect ratio changes separately
watch([aspectRatio], () => {
  emit('format', { platform: selectedFormat.value, ratio: aspectRatio.value });
});

// Switch tabs
const switchTab = (tab) => {
  // Forward the tab change event to the parent component
  // The parent will update the activeTab prop
  emit('tab-change', tab);
};

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

// Handle image download with proper cropping
const handleDownload = async () => {
  if (!props.optimizedImage) return;
  
  try {
    // Use different image source based on active tab
    let imageUrl;
    
    if (activeTab.value === 'format' && props.cropImage) {
      // Use the cropImageToFormat function to get properly cropped image
      imageUrl = await props.cropImage();
    } else {
      // For resize tab or if cropImage isn't available, use the regular optimized image
      imageUrl = props.optimizedImage.url;
    }
    
    // Create a download link and trigger it
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `optimized-${props.originalImage.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};

// Watch compression changes and emit optimize event with inverted quality value
watch(compression, (newCompression) => {
  // Convert compression to quality (100 - compression)
  // Map the 20-95% range to a more effective quality range
  const quality = 100 - newCompression;
  emit('optimize', quality);
}, { immediate: true });

</script>

<template>
  <div class="p-4 bg-slate-200 dark:bg-gray-700 rounded-lg flex flex-col h-full">
    <!-- Feature tabs component at the top -->
    <FeatureTabs @tab-change="switchTab" v-slot="{ activeTab }">
      <!-- Resize tab content -->
      <div v-if="activeTab === 'resize'" class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
        <!-- Image details (only shown in resize tab) -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-semibold">Image Details</h3>
          </div>

          <div class="space-y-2">
            <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
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
            
            <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
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
            
            <div v-if="optimizedImage" class="bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Size reduction</p>
              <p class="text-base font-medium" :class="reduction > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'">
                <i :class="[reduction > 0 ? 'fas fa-check-circle' : 'fas fa-exclamation-circle', 'mr-1']"></i> 
                {{ formatSize(Math.abs(originalImage.size - optimizedImage.size)) }} {{ reduction > 0 ? 'saved' : 'saved' }}
              </p>
            </div>
          </div>
        </div>

        <h3 class="text-lg font-semibold mb-2">Compression Settings</h3>
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

      <!-- Format tab content -->
      <div v-if="activeTab === 'format'" class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-4">
        <h3 class="text-lg font-semibold mb-3">Format Settings</h3>
        
        <!-- Formatting explanation 
        <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
          <p class="text-xs text-blue-700 dark:text-blue-300">
            <i class="fas fa-info-circle mr-2"></i>
            Select platform and aspect ratio. Drag the image within the crop window to control what's visible in the final result.
          </p>
        </div>-->
        
        <!-- Social media selector -->
        <div class="mb-4">
          <label class="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Social Media Platform:</label>
          <div class="grid grid-cols-6 gap-2">
            <button 
              v-for="option in formatOptions" 
              :key="option.id"
              @click="selectedFormat = option.id"
              :class="['w-8 h-8 rounded-md font-medium flex items-center justify-center transition-colors', 
                selectedFormat === option.id ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500']"
              :title="option.name"
            >
              <i :class="[option.icon, 'text-xl']"></i>
            </button>
          </div>
        </div>
        
        <!-- Aspect ratio selector -->
        <div>
          <label class="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Aspect Ratio:</label>
          <div class="flex justify-between gap-2">
            <div 
              v-for="ratioOption in formatOptions.find(opt => opt.id === selectedFormat).ratios" 
              :key="ratioOption.ratio"
              class="flex-1 relative"
            >
              <!-- The entire card follows the aspect ratio -->
              <button 
                @click="aspectRatio = ratioOption.ratio"
                :class="['w-full flex flex-col items-center justify-between rounded-md border-2 bg-gray-300 dark:bg-gray-600 overflow-hidden', 
                  aspectRatio === ratioOption.ratio ? 'border-green-600 dark:border-green-500' : 'border-gray-300 dark:border-gray-600']"
                :style="{
                  aspectRatio: ratioOption.ratio.replace(':', '/'),
                  minHeight: '75px',
                  maxHeight: ratioOption.ratio.startsWith('9') ? '200px' : '160px'
                }"
              >
                <!-- Ratio text at the top -->
                <div class="w-full pt-1 px-2 text-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ ratioOption.ratio }}
                  </span>
                </div>
                
                <!-- Empty space in the middle 
                <div class="flex-grow"></div>-->
                
                <!-- Label and resolution at the bottom -->
                <div class="w-full pb-1 px-1 text-center">
                  <div class="text-[12px] font-medium text-gray-800 dark:text-gray-200">{{ ratioOption.label }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-300">{{ ratioOption.resolution }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Convert tab content (placeholder) -->
      <div v-if="activeTab === 'convert'" class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
        <h3 class="text-lg font-semibold mb-3">Convert Settings</h3>
        <p class="text-gray-600 dark:text-gray-400">Coming soon...</p>
      </div>
    </FeatureTabs>

    <!-- Spacer to push download button to bottom -->
    <div class="flex-grow"></div>
    
    <!-- Actions -->
    <div class="flex flex-col space-y-3 mt-auto">       
      <a 
        v-if="optimizedImage" 
        @click="handleDownload"
        href="#" 
        class="w-full px-4 py-3 bg-green-800 text-white hover:bg-green-700 rounded-lg transition-colors text-center font-medium cursor-pointer"
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
