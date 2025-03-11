<template>
  <div>
    <main class="rounded-lg shadow-lg p-4 md:p-8 bg-slate-100 dark:bg-gray-800 transition-colors duration-300 w-full mx-auto" style="min-height: 700px;">
      <h1 class="text-2xl font-bold mb-1 text-center">Free Image Resizer</h1>
      <p class="text-gray-600 dark:text-gray-400 text-center mb-12 w-1/2 mx-auto">Instantly reduce your image file size, effortlessly adapt them for any social media platform, and quickly convert between image formats.</p>

      <!-- Image upload area -->
      <ImageUploader 
        v-if="!originalImage" 
        @image-uploaded="handleImageUpload" 
      />

      <!-- Image preview and controls -->
      <div v-else class="flex flex-col lg:flex-row gap-8 h-full">
        <!-- Image comparison component -->
        <div class="lg:w-3/4 flex flex-col">
          <h3 class="text-lg font-semibold mb-3">Preview</h3>
          <div class="flex-grow">
            <!-- Different components based on active feature -->
            <template v-if="activeFeature === 'resize' && optimizedImage">
              <ImageResizeMode
                :original-image="originalImage"
                :optimized-image="optimizedImage"
                :slider-position="sliderPosition"
                @update-slider="updateSliderPosition"
                @slider-drag="handleSliderDrag"
              />
            </template>
            
            <!-- FORMAT MODE - A completely different component tree -->
            <template v-else-if="activeFeature === 'format' && originalImage">
              <ImageFormatMode
                :original-image="originalImage"
                :format-state="formatState"
                @format-change="handleFormat"
                @crop-image-ready="cropFunc => cropImageFunction = cropFunc"
              />
            </template>
            
            <!-- CONVERT MODE - For changing file format -->
            <template v-else-if="activeFeature === 'convert' && originalImage">
              <ImageConvertMode
                :original-image="originalImage"
                @format-selected="handleFormatSelection"
              />
            </template>

            <!-- Loading state -->
            <template v-else>
              <div class="flex justify-center items-center h-full bg-gray-100 dark:bg-gray-700 rounded">
                <i class="fas fa-spinner fa-spin text-3xl"></i>
              </div>
            </template>
          </div>
        </div>

        <!-- Controls section -->
        <div class="lg:w-1/4 flex flex-col">
          <div class="flex justify-end mb-2">
            <button 
              @click="handleReset" 
              class="text-sm px-3 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              title="Reset to default settings"
            >
              <i class="fas fa-undo-alt mr-1"></i>Reset
            </button>
          </div>

          <div class="flex-grow">
            <ImageControls 
              :original-image="originalImage" 
              :optimized-image="optimizedImage" 
              :is-processing="isProcessing"
              :active-tab="activeFeature"
              :format-state="formatState"
              :crop-image="cropImageFunction"
              :current-quality="currentQuality"
              :selected-format="selectedFormat"
              @reset="handleReset"
              @optimize="handleOptimize"
              @format="handleFormat"
              @tab-change="handleTabChange"
              @convert-format="handleFormatSelection"
              class="h-full"
            />
          </div>
        </div>
      </div>
    </main>

    <ContentSection />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ImageUploader from '../components/ImageUploader.vue'
import ImageControls from '../components/ImageControls.vue'
import ImageResizeMode from '../components/ImageResizeMode.vue'
import ImageFormatMode from '../components/ImageFormatMode.vue'
import ImageConvertMode from '../components/ImageConvertMode.vue'
import ContentSection from '../components/ContentSection.vue'
import Footer from '../components/Footer.vue'

// Define emits
const emit = defineEmits(['toggleTheme'])

// Props
const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

// State
const originalImage = ref(null)
const optimizedImage = ref(null)
const activeFeature = ref('resize') // resize, format
const isProcessing = ref(false)
const sliderPosition = ref(50)
const selectedFormat = ref('webp')
const currentQuality = ref(80)

// Format mode state
const formatState = ref({
  width: 800,
  height: 600,
  maintainAspectRatio: true,
  cropMode: false
})

// Crop function reference (will be set by the ImageFormatMode component)
const cropImageFunction = ref(null)

// Image size calculations
const originalSizeKB = computed(() => {
  if (!originalImage.value) return 0
  return Math.round(originalImage.value.size / 1024)
})

const optimizedSizeKB = computed(() => {
  if (!optimizedImage.value) return 0
  return Math.round(optimizedImage.value.size / 1024)
})

const compressionRatio = computed(() => {
  if (!originalImage.value || !optimizedImage.value) return 0
  return Math.round((1 - optimizedImage.value.size / originalImage.value.size) * 100)
})

// Handle image upload
function handleImageUpload(file) {
  console.log('Received file in Home:', file);
  
  // Clean up any previous object URLs to avoid memory leaks
  if (originalImage.value?.url) {
    URL.revokeObjectURL(originalImage.value.url);
  }
  
  // Create a URL for the original image
  const url = URL.createObjectURL(file);
  console.log('Created URL:', url);
  
  // Create the initial image object
  originalImage.value = {
    file,
    url,
    size: file.size,
    name: file.name,
    type: file.type
  }
  
  // Get image dimensions
  const img = new Image();
  img.onload = () => {
    // Update the original image with dimensions
    originalImage.value = {
      ...originalImage.value,
      width: img.naturalWidth,
      height: img.naturalHeight
    };
    
    // Start optimization with the dimensions
    optimizeImage();
  };
  img.onerror = () => {
    console.error('Failed to load image for dimension detection');
    // Still continue with optimization even if dimension detection fails
    optimizeImage();
  };
  img.src = url;
  
  // Reset optimized image
  optimizedImage.value = null;
}

// Handle optimization
async function handleOptimize(quality) {
  console.log('Optimizing with quality:', quality)
  currentQuality.value = quality
  await optimizeImage(quality)
}

// Handle format change
function handleFormat(formatData) {
  Object.assign(formatState.value, formatData)
}

// Handle tab change
function handleTabChange(tab) {
  activeFeature.value = tab
}

// Handle format selection for conversion
function handleFormatSelection(format) {
  selectedFormat.value = format
}

// Reset all state
function handleReset() {
  // Clean up object URLs
  if (originalImage.value?.url) {
    URL.revokeObjectURL(originalImage.value.url);
  }
  if (optimizedImage.value?.url && optimizedImage.value.url !== originalImage.value?.url) {
    URL.revokeObjectURL(optimizedImage.value.url);
  }
  
  // Reset state
  originalImage.value = null
  optimizedImage.value = null
  activeFeature.value = 'resize'
  sliderPosition.value = 50
  selectedFormat.value = 'webp'
  currentQuality.value = 80
  isProcessing.value = false
}

// Update slider position
function updateSliderPosition(position) {
  sliderPosition.value = position
}

// Handle slider drag
function handleSliderDrag(isDragging) {
  // Handle slider drag state
}

// Optimize image
async function optimizeImage(quality = currentQuality.value) {
  if (!originalImage.value) return;
  
  console.log('Starting optimization process with quality:', quality);
  isProcessing.value = true;

  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Creating optimized image');
    
    // Calculate compression ratio based on quality
    // Lower quality = higher compression = smaller file size
    const compressionRatio = quality / 100;
    
    // Higher quality means less reduction (quality 100 = no reduction)
    // Lower quality means more reduction (quality 1 = maximum reduction)
    // We're limiting the max reduction to 90% even at the lowest quality
    const sizeReductionFactor = 1 - ((100 - quality) / 100) * 0.9;
    
    // For demo purposes, we create an optimized version with a size based on the quality
    // In a real app, you would apply actual compression here
    optimizedImage.value = {
      file: originalImage.value.file,
      url: originalImage.value.url, // Using the same URL for demo purposes
      size: Math.round(originalImage.value.size * sizeReductionFactor), // Adjust size based on quality
      name: originalImage.value.name,
      type: originalImage.value.type,
      width: originalImage.value.width,
      height: originalImage.value.height
    };
    
    console.log('Optimized image created:', optimizedImage.value);
    console.log('Size reduction:', (1 - sizeReductionFactor) * 100, '%');
  } catch (error) {
    console.error('Error optimizing image:', error);
  } finally {
    isProcessing.value = false;
  }
}

// Watch for active feature changes
watch(activeFeature, (newFeature) => {
  if (newFeature === 'resize' && !optimizedImage.value && originalImage.value) {
    optimizeImage()
  }
})
</script>
