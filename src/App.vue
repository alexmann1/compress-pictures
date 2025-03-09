<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ImageUploader from './components/ImageUploader.vue'
import ImageCompare from './components/ImageCompare.vue'
import ImageControls from './components/ImageControls.vue'
import ThemeToggle from './components/ThemeToggle.vue'

// Theme state
const isDarkMode = ref(false)

// Image data
const originalImage = ref(null)
const optimizedImage = ref(null)
const isProcessing = ref(false)

// Format state
const formatState = ref({
  platform: 'instagram',
  ratio: '1:1',
  position: { x: 0, y: 0 } // Initial position (pixel values, will be centered)
})

// Active feature tab
const activeFeature = ref('resize')

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

// No need to watch quality as it's now handled in the ImageControls component

// Handle optimization from controls component
const handleOptimize = (qualityValue) => {
  if (!originalImage.value || isProcessing.value) return;
  processImage(qualityValue);
};

// Handle format changes from the controls component
const handleFormat = (formatData) => {
  if (!originalImage.value) return;
  // Keep the position when changing format or ratio
  formatState.value = {
    ...formatData,
    position: formatState.value.position || { x: 50, y: 50 }
  };
};

// Handle image repositioning
const isDragging = ref(false);
const startPos = ref({ x: 0, y: 0 });

const startDrag = (e) => {
  e.preventDefault(); // Prevent default browser behavior
  isDragging.value = true;
  
  // Get mouse or touch position
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);
  
  startPos.value = {
    x: clientX,
    y: clientY
  };
  
  // Instead of using pointer lock (which hides cursor), we'll use a custom approach
  // that tracks initial position and calculates deltas for a better UX
  
  // Add move and end event listeners
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('touchmove', handleDrag, { passive: false });
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);
  
  // Add a class to the body to change cursor during drag
  document.body.classList.add('grabbing-cursor');
};

const handleDrag = (e) => {
  if (!isDragging.value) return;
  e.preventDefault(); // Prevent scrolling on touch devices
  
  // Instead of using mouse position, we'll use movement delta directly
  // This works even with the cursor visible
  const movementX = e.movementX || 0;
  const movementY = e.movementY || 0;
  
  // Apply a higher sensitivity factor for more responsive movement
  const sensitivityFactor = 1.2;
  const adjustedDeltaX = movementX * sensitivityFactor;
  const adjustedDeltaY = movementY * sensitivityFactor;
  
  // Calculate new position
  const newX = formatState.value.position.x + adjustedDeltaX;
  const newY = formatState.value.position.y + adjustedDeltaY;
  
  // Get container and image elements to calculate boundaries
  const container = document.querySelector('.format-container');
  const image = container?.querySelector('img');
  
  if (container && image) {
    // Get the container and image dimensions
    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    
    // Calculate maximum allowed drag distance in each direction
    const maxX = Math.max(0, (imageRect.width - containerRect.width) / 2);
    const maxY = Math.max(0, (imageRect.height - containerRect.height) / 2);
    
    // Apply boundaries to prevent blank spaces
    formatState.value.position = {
      x: Math.min(Math.max(newX, -maxX), maxX),
      y: Math.min(Math.max(newY, -maxY), maxY)
    };
  } else {
    // Fallback if elements not found
    formatState.value.position = { x: newX, y: newY };
  }
};

const endDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchend', endDrag);
  
  // Remove the grabbing cursor class
  document.body.classList.remove('grabbing-cursor');
  
  // Reset any tracking state
};

// Helper functions to calculate image dimensions based on aspect ratio
const calculateImageWidth = (image, targetRatio) => {
  if (!image) return '100%';
  
  // Get image and target aspect ratios
  const imageRatio = image.width / image.height;
  const [targetWidth, targetHeight] = targetRatio.split(':').map(Number);
  const containerRatio = targetWidth / targetHeight;
  
  // Calculate if we need to scale up at all
  const ratioMismatch = Math.abs(imageRatio - containerRatio) / containerRatio;
  
  // If it's an exact match or very close (within 1%), show at 100%
  if (ratioMismatch < 0.01) {
    return '100%';
  }
  
  // This is the key change - we determine if the image matches either dimension
  // perfectly, and if so, we use that dimension as the controlling factor
  if (Math.abs(imageRatio - containerRatio) < 0.1) {
    // Aspect ratios are sufficiently similar, show at 100%
    return '100%';
  } else if (imageRatio > containerRatio) {
    // Image is wider (landscape) than container (portrait) - let height be fixed and width auto
    return 'auto';
  } else {
    // Image is taller (portrait) than container (landscape) - use 100% width
    return '100%';
  }
};

const calculateImageHeight = (image, targetRatio) => {
  if (!image) return '100%';
  
  // Get image and target aspect ratios
  const imageRatio = image.width / image.height;
  const [targetWidth, targetHeight] = targetRatio.split(':').map(Number);
  const containerRatio = targetWidth / targetHeight;
  
  // Calculate if we need to scale up at all
  const ratioMismatch = Math.abs(imageRatio - containerRatio) / containerRatio;
  
  // If it's an exact match or very close (within 1%), show at 100%
  if (ratioMismatch < 0.01) {
    return '100%';
  }
  
  // This is the key change - we determine if the image matches either dimension
  // perfectly, and if so, we use that dimension as the controlling factor
  if (Math.abs(imageRatio - containerRatio) < 0.1) {
    // Aspect ratios are sufficiently similar, show at 100%
    return '100%';
  } else if (imageRatio < containerRatio) {
    // Image is taller (portrait) than container (landscape) - let width be fixed and height auto
    return 'auto';
  } else {
    // Image is wider (landscape) than container (portrait) - use 100% height
    return '100%';
  }
};

// Slider position for resize mode
const sliderPosition = ref(50);

// Update slider position
const updateSliderPosition = (position) => {
  sliderPosition.value = Math.min(Math.max(position, 0), 100);
};

// Slider drag handler
const handleSliderDrag = (e) => {
  if (!originalImage.value || !optimizedImage.value) return;
  
  const container = document.querySelector('.resize-container');
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  const position = ((e.clientX - rect.left) / rect.width) * 100;
  updateSliderPosition(position);
  
  // Set up mouse move and mouse up handlers
  const handleMouseMove = (moveEvent) => {
    const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
    updateSliderPosition(newPosition);
  };
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// Handle tab changes
const handleTabChange = (tab) => {
  activeFeature.value = tab;
  
  // Force update of the UI when changing tabs
  if (tab === 'format' && originalImage.value) {
    // Make sure formatState is properly applied
    const currentFormat = formatState.value;
    formatState.value = { ...currentFormat };
    
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
    ratio: '1:1'
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

// Calculate size reduction
const reduction = computed(() => {
  if (originalImage.value && optimizedImage.value) {
    const originalSize = originalImage.value.size
    const optimizedSize = optimizedImage.value.size
    const percentage = ((originalSize - optimizedSize) / originalSize) * 100
    return percentage.toFixed(2)
  }
  return '0'
})

// Format size for display (KB, MB)
const formatSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
}

// Crop image based on selected aspect ratio and current position
const cropImageToFormat = async () => {
  if (!originalImage.value || !formatState.value.ratio || activeFeature.value !== 'format') {
    // If not in format mode or no image/ratio, return the original/optimized image
    return optimizedImage.value ? optimizedImage.value.url : (originalImage.value ? originalImage.value.url : null);
  }
  
  return new Promise((resolve) => {
    // Find the format container and image element
    const container = document.querySelector('.format-container');
    const displayImg = container?.querySelector('img');
    
    if (!container || !displayImg) {
      console.error('Could not find format container or image');
      resolve(originalImage.value.url);
      return;
    }
    
    // Create a new image to work with
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      // Create a canvas with the correct aspect ratio
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Parse aspect ratio
      const [targetWidth, targetHeight] = formatState.value.ratio.split(':').map(Number);
      
      // Set output dimensions (use standard social media size)
      const outputWidth = 1080; // Standard width for most platforms
      const outputHeight = Math.round((outputWidth * targetHeight) / targetWidth);
      
      // Set canvas size to match the desired aspect ratio
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      
      // Get the dimensions and position information
      const containerRect = container.getBoundingClientRect();
      const imgRect = displayImg.getBoundingClientRect();
      
      // Calculate how the image is scaled in the UI
      const displayedImageRatio = imgRect.width / imgRect.height;
      const originalImageRatio = img.width / img.height;
      
      // Calculate what portion of the original image is displayed
      let visibleWidth, visibleHeight, offsetX, offsetY;
      
      if (displayedImageRatio > originalImageRatio) {
        // Image is stretched wider in the UI
        visibleWidth = img.width;
        visibleHeight = img.width / displayedImageRatio;
        offsetX = 0;
        offsetY = (img.height - visibleHeight) / 2;
      } else {
        // Image is stretched taller in the UI
        visibleHeight = img.height;
        visibleWidth = img.height * displayedImageRatio;
        offsetX = (img.width - visibleWidth) / 2;
        offsetY = 0;
      }
      
      // Calculate what portion of the visible image is within the container
      const containerRatio = containerRect.width / containerRect.height;
      
      // Calculate the visible area width and height in the original image coordinates
      const viewportWidth = containerRect.width / imgRect.width * visibleWidth;
      const viewportHeight = containerRect.height / imgRect.height * visibleHeight;
      
      // Apply the user's drag position
      const dragOffsetX = formatState.value.position.x / imgRect.width * visibleWidth;
      const dragOffsetY = formatState.value.position.y / imgRect.height * visibleHeight;
      
      // Calculate the final source coordinates for what to draw
      const sourceX = offsetX + (visibleWidth - viewportWidth) / 2 - dragOffsetX;
      const sourceY = offsetY + (visibleHeight - viewportHeight) / 2 - dragOffsetY;
      
      // Draw the visible portion to the canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(
        img,
        Math.max(0, sourceX),
        Math.max(0, sourceY),
        Math.min(viewportWidth, img.width - sourceX),
        Math.min(viewportHeight, img.height - sourceY),
        0, 0, canvas.width, canvas.height
      );
      
      // Return the cropped image as data URL with good quality
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    
    // Use the original image for the crop
    img.src = originalImage.value.url;
  });
};
</script>

<template>
  <div :class="['min-h-screen transition-colors duration-300', isDarkMode ? 'dark' : 'light']">
    <div class="w-full px-4 md:px-6">
      <!-- Header with theme toggle -->
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">
          <i class="fas fa-image mr-2"></i> Image Optimizer
        </h1>
        <ThemeToggle :is-dark="isDarkMode" @toggle="toggleTheme" />
      </header>

      <!-- Main content -->
      <main class="rounded-lg shadow-lg p-4 md:p-8 bg-slate-100 dark:bg-gray-800 transition-colors duration-300 w-full mx-auto" style="min-height: 700px;">
        <!-- Image upload area -->
        <ImageUploader 
          v-if="!originalImage" 
          @image-uploaded="handleImageUpload" 
        />

        <!-- Image preview and controls -->
        <div v-else class="flex flex-col lg:flex-row gap-8 h-full">
          <!-- Image comparison component -->
          <div class="lg:w-3/4 flex flex-col">
            <h3 class="text-lg font-semibold mb-3">Image Comparison</h3>
            <div class="flex-grow">
              <!-- Different components based on active feature -->
              <!-- DEBUG 
              <div class="absolute top-0 left-0 bg-red-500 text-white p-2 z-50">
                Current Mode: {{ activeFeature }}
              </div>-->
              <template v-if="activeFeature === 'resize' && optimizedImage">
                <!-- RESIZE MODE - Completely isolated component -->
                <div class="h-full resize-mode">
                  <div 
                    class="resize-container relative w-full h-full overflow-hidden rounded-lg bg-slate-200 dark:bg-gray-700 min-h-[650px]"
                    @mousedown.prevent="handleSliderDrag"
                    @touchstart.prevent="e => handleSliderDrag(e.touches[0])"
                  >
                    <!-- Comparison container -->
                    <div class="relative w-full h-full flex items-center justify-center">
                      <!-- Original image (background) -->
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div 
                          class="relative overflow-hidden bg-contain bg-center bg-no-repeat" 
                          :style="{ 
                            backgroundImage: `url(${originalImage.url})`,
                            width: '100%',
                            height: '100%',
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain'
                          }"
                        >
                          <!-- Optimized image (foreground with clip) -->
                          <div 
                            class="absolute inset-0 bg-contain bg-center bg-no-repeat optimized-image" 
                            :style="{ 
                              backgroundImage: `url(${optimizedImage.url})`,
                              clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                              backgroundSize: 'contain'
                            }"
                          ></div>
                        </div>
                      </div>
                      
                      <!-- Divider line-->
                      <div 
                        class="slider-divider absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-10 shadow-lg"
                        :style="{left: `${sliderPosition}%`}"
                      >
                        <!-- Divider handle -->
                        <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <i class="fas fa-arrows-alt-h text-blue-600"></i>
                        </div>
                      </div>
                      
                      <!-- Original label (left side) -->
                      <div class="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
                        Original
                      </div>
                      
                      <!-- Optimized label (right side) -->
                      <div class="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
                        Optimized
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- FORMAT MODE - A completely different component tree -->
              <template v-else-if="activeFeature === 'format' && originalImage">
                <div class="h-full format-mode">
                  <div class="relative w-full h-full overflow-hidden rounded-lg bg-slate-200 dark:bg-gray-700 min-h-[650px]">
                    <div class="w-full h-full flex items-center justify-center p-6">
                      <!-- Image container with aspect ratio -->
                      <!-- Fixed aspect ratio container (crop window) -->
                      <div 
                        class="relative bg-slate-100 dark:bg-gray-600 overflow-hidden format-container cursor-move"
                        :style="{ 
                          aspectRatio: formatState.ratio ? formatState.ratio.replace(':', '/') : 'auto',
                          width: formatState.ratio === '1:1' ? '70%' : 
                                 formatState.ratio === '4:5' ? '60%' : 
                                 formatState.ratio === '9:16' ? '40%' : 
                                 formatState.ratio === '16:9' ? '85%' : '70%',
                          maxHeight: '90%',
                          border: '3px solid rgba(22, 163, 74, 0.5)',
                        }"
                        @mousedown="startDrag"
                        @touchstart="startDrag"
                      >
                        <!-- Image container showing the full image through the crop window -->
                        <div class="absolute inset-0 overflow-hidden">
                          <img 
                            :src="originalImage.url"
                            class="absolute max-w-none max-h-none transition-all duration-100"
                            :style="{
                              /* Use consistent sizing that respects the original image */
                              width: originalImage && originalImage.width ? calculateImageWidth(originalImage, formatState.ratio) : '100%',
                              height: originalImage && originalImage.height ? calculateImageHeight(originalImage, formatState.ratio) : '100%',
                              minWidth: '100%', /* Ensure image is at least the size of container */
                              minHeight: '100%', /* Ensure image is at least the size of container */
                              left: '50%',
                              top: '50%',
                              transform: `translate(-50%, -50%) translateX(${formatState.position.x}px) translateY(${formatState.position.y}px)`,
                            }"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Platform label -->
                    <div class="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
                      Platform: {{ formatState.platform }}
                    </div>
                    
                    <!-- Format label -->
                    <div class="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
                      Aspect Ratio: {{ formatState.ratio }}
                    </div>
                    
                    <!-- Repositioning guide -->
                    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
                      <i class="fas fa-arrows-alt mr-1"></i> Drag to position your image
                    </div>
                    
                    <!-- Visual indicator that image is being dragged -->
                    <div v-if="isDragging" class="absolute inset-0 border-4 border-green-400/50 rounded-lg pointer-events-none">
                    </div>
                  </div>
                </div>
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
                :crop-image="cropImageToFormat"
                :active-tab="activeFeature"
                @reset="handleReset"
                @optimize="handleOptimize"
                @format="handleFormat"
                @tab-change="handleTabChange"
                class="h-full"
              />
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Built by MNCN Labs</p>
      </footer>
    </div>
  </div>
</template>
