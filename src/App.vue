<script setup>
import { ref, watch, onMounted } from 'vue'
import ImageUploader from './components/ImageUploader.vue'
import ImageControls from './components/ImageControls.vue'
import ImageResizeMode from './components/ImageResizeMode.vue'
import ImageFormatMode from './components/ImageFormatMode.vue'
import ImageConvertMode from './components/ImageConvertMode.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import ContentSection from './components/ContentSection.vue'
import Footer from './components/Footer.vue'

// Theme state
const isDarkMode = ref(false)

// Image data
const originalImage = ref(null)
const optimizedImage = ref(null)
const isProcessing = ref(false)

// Active feature tab - must be defined before using it in watchers
const activeFeature = ref('resize')

// For cropping images during format download
const cropImageFunction = ref(null)

// Track the current quality setting for resize
const currentQuality = ref(80) // Default 80%

// Selected format for conversion (jpg, png, webp, gif, svg)
const selectedFormat = ref('jpg')

// Format state
const formatState = ref({
  platform: 'instagram',
  ratio: '1:1',
  position: { x: 0, y: 0 } // Initial position (pixel values, will be centered)
})

// Ensure formatState is always properly initialized
watch(() => activeFeature.value, (newTab) => {
  if (newTab === 'format') {
    // Make sure position is defined
    if (!formatState.value.position) {
      formatState.value.position = { x: 0, y: 0 };
    }
  }
})

// Handle image upload
const handleImageUpload = (file) => {
  // Reset existing data
  optimizedImage.value = null
  isProcessing.value = true
  
  // Set original image
  originalImage.value = {
    file,
    url: URL.createObjectURL(file),
    size: file.size,
    name: file.name,
    type: file.type,
    width: 0,
    height: 0,
    isLandscape: false
  }
  
  // Reset position to center for new image
  formatState.value.position = { x: 0, y: 0 }
  
  // Load image dimensions
  const img = new Image()
  img.onload = () => {
    originalImage.value.width = img.width
    originalImage.value.height = img.height
    originalImage.value.isLandscape = img.width > img.height
    // Use 35 as the quality value (100 - 65% compression)
    processImage(35)
  }
  img.src = originalImage.value.url
}

// Process image with given quality
const processImage = async (qualityValue = 80) => {
  if (!originalImage.value) return
  
  isProcessing.value = true
  
  try {
    // Special handling for SVG files
    if (originalImage.value.type === 'image/svg+xml') {
      // SVGs can't be compressed with the canvas quality method
      // Just create a copy of the original
      optimizedImage.value = {
        url: originalImage.value.url,
        size: originalImage.value.size,
        type: originalImage.value.type,
        width: originalImage.value.width,
        height: originalImage.value.height
      }
      isProcessing.value = false
      return
    }
    
    // Use JavaScript's Canvas API for compression of raster images
    const img = new Image()
    img.src = originalImage.value.url
    
    await new Promise(resolve => {
      img.onload = resolve
    })
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    canvas.width = originalImage.value.width
    canvas.height = originalImage.value.height
    
    // Draw image on canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    
    // Special case: if quality is 100 (0% compression), just use the original image
    // This prevents any re-encoding artifacts that might increase file size
    if (qualityValue >= 100) {
      optimizedImage.value = {
        url: originalImage.value.url,
        size: originalImage.value.size,
        type: originalImage.value.type,
        width: originalImage.value.width,
        height: originalImage.value.height
      }
      isProcessing.value = false
      return
    }
    
    // Determine output format and mime type
    let outputType = originalImage.value.type
    
    // For some formats, convert to JPEG for better compression
    if (['image/gif', 'image/png'].includes(originalImage.value.type) && qualityValue < 90) {
      outputType = 'image/jpeg'
    }
    
    // Convert to blob with quality parameter
    // Quality should be between 0.1 and 0.9 for effective compression
    const blobQuality = Math.max(0.1, Math.min(0.9, qualityValue / 100));
    
    canvas.toBlob(blob => {
      if (!blob) {
        console.error('Failed to create blob from canvas')
        isProcessing.value = false
        return
      }
      
      // If the compressed size is larger than original, use the original
      if (blob.size > originalImage.value.size) {
        optimizedImage.value = {
          url: originalImage.value.url,
          size: originalImage.value.size,
          type: originalImage.value.type,
          width: originalImage.value.width,
          height: originalImage.value.height
        }
      } else {
        // Create optimized image data
        const url = URL.createObjectURL(blob)
        optimizedImage.value = {
          url,
          size: blob.size,
          type: blob.type,
          width: originalImage.value.width,
          height: originalImage.value.height
        }
      }
      
      isProcessing.value = false
    }, outputType, blobQuality)
  } catch (error) {
    console.error('Error optimizing image:', error)
    isProcessing.value = false
  }
}

// Handle optimization from controls component
const handleOptimize = (qualityValue) => {
  if (!originalImage.value || isProcessing.value) return;
  // Update the current quality value
  currentQuality.value = qualityValue;
  processImage(qualityValue);
};

// Handle format changes from the controls component
const handleFormat = (formatData) => {
  if (!originalImage.value) return;
  
  // Ensure formatData has all required properties
  const newFormatState = {
    platform: formatData.platform || formatState.value.platform || 'instagram',
    ratio: formatData.ratio || formatState.value.ratio || '1:1',
    // Only update position if provided, otherwise keep the current position
    position: formatData.position || formatState.value.position || { x: 0, y: 0 }
  };
    
  // Important: Create a new object reference to trigger reactivity
  formatState.value = { ...newFormatState };
};

// Handle format selection for the convert tab
const handleFormatSelection = (format) => {
  if (!originalImage.value) return;
  selectedFormat.value = format;
};

// Slider position for resize mode
const sliderPosition = ref(50);

// Update slider position
const updateSliderPosition = (position) => {
  sliderPosition.value = Math.min(Math.max(position, 0), 100);
};

// Slider drag handler - This is now a delegate function that passes the event to the ImageResizeMode component
const handleSliderDrag = (e) => {
  // Implementation has moved to ImageResizeMode component
};

// Handle tab changes
const handleTabChange = (tab) => {
  activeFeature.value = tab;
  
  // Force update of the UI when changing tabs
  if (tab === 'format' && originalImage.value) {
    // Reset any resize-specific elements
    const divider = document.querySelector('.slider-divider');
    if (divider) divider.style.display = 'none';
  } else if (tab === 'resize' && originalImage.value && optimizedImage.value) {
    // Reset slider to middle position
    updateSliderPosition(50);
    
    // Show resize divider again
    const divider = document.querySelector('.slider-divider');
    if (divider) divider.style.display = 'block';
  }
};

// Reset handler
const handleReset = () => {
  originalImage.value = null
  optimizedImage.value = null
  formatState.value = {
    platform: 'instagram',
    ratio: '1:1',
    position: { x: 0, y: 0 }
  }
}

// Initialize theme based on user preference
onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = prefersDark
  document.documentElement.classList.toggle('dark', isDarkMode.value)
})

// Toggle theme
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'dark' : 'light'">
    <div class="w-full px-4 md:px-6">
      <!-- Header with theme toggle -->
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-lg font-bold">
          <i class="fas fa-image mr-2"></i> CompressPictures.com
        </h1>
        <ThemeToggle :is-dark="isDarkMode" @toggle="toggleTheme" />
      </header>

      <!-- Main content -->
      <router-view v-slot="{ Component }">
        <component :is="Component" :isDarkMode="isDarkMode" @toggleTheme="toggleTheme" />
      </router-view>
    </div>
  </div>
</template>
