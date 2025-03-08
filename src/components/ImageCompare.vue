<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  originalSrc: {
    type: String,
    required: true
  },
  optimizedSrc: {
    type: String,
    required: true
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
});

const container = ref(null);
const divider = ref(null);
const sliderPosition = ref(50);
const optimizedImageEl = ref(null);

// Update slider position and clip path
const updateSliderPosition = (position) => {
  // Constrain position between 0 and 100
  const constrainedPosition = Math.min(Math.max(position, 0), 100);
  sliderPosition.value = constrainedPosition;
  
  // Update divider position
  if (divider.value) {
    divider.value.style.left = `${constrainedPosition}%`;
  }
  
  // Update clip path for the optimized image
  if (optimizedImageEl.value) {
    optimizedImageEl.value.style.clipPath = `inset(0 0 0 ${constrainedPosition}%)`;
  }
};

// Handle mouse down on divider
const handleMouseDown = (e) => {
  e.preventDefault();
  
  if (!container.value) return;
  
  const containerRect = container.value.getBoundingClientRect();
  
  const calculatePosition = (clientX) => {
    return ((clientX - containerRect.left) / containerRect.width) * 100;
  };
  
  // Initial update
  updateSliderPosition(calculatePosition(e.clientX));
  
  // Mouse move handler
  const handleMouseMove = (moveEvent) => {
    updateSliderPosition(calculatePosition(moveEvent.clientX));
  };
  
  // Mouse up handler
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// Handle touch start on divider
const handleTouchStart = (e) => {
  e.preventDefault();
  
  if (!container.value || e.touches.length === 0) return;
  
  const containerRect = container.value.getBoundingClientRect();
  
  const calculatePosition = (clientX) => {
    return ((clientX - containerRect.left) / containerRect.width) * 100;
  };
  
  // Initial update
  updateSliderPosition(calculatePosition(e.touches[0].clientX));
  
  // Touch move handler
  const handleTouchMove = (moveEvent) => {
    if (moveEvent.touches.length > 0) {
      updateSliderPosition(calculatePosition(moveEvent.touches[0].clientX));
    }
  };
  
  // Touch end handler
  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };
  
  // Add event listeners
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('touchend', handleTouchEnd);
};

// Reset slider position when images change
watch(() => [props.originalSrc, props.optimizedSrc], () => {
  updateSliderPosition(50);
});

onMounted(() => {
  // Set initial position
  updateSliderPosition(50);
});
</script>

<template>
  <div 
    ref="container" 
    class="relative w-full h-full overflow-hidden rounded-lg bg-slate-200 dark:bg-gray-700"
    style="min-height: 650px; max-width: 100%;"
  >
    <!-- Loading indicator -->
    <div 
      v-if="isProcessing" 
      class="absolute inset-0 flex items-center justify-center bg-slate-400 dark:bg-gray-700 z-20"
    >
      <i class="fas fa-spinner fa-spin text-3xl"></i>
    </div>
    
    <!-- Original image (background) -->
    <div class="absolute inset-0 bg-contain bg-center bg-no-repeat" :style="{ backgroundImage: `url(${originalSrc})` }"></div>
    
    <!-- Optimized image (foreground with clip) -->
    <div 
      ref="optimizedImageEl"
      class="absolute inset-0 bg-contain bg-center bg-no-repeat optimized-image" 
      :style="{ 
        backgroundImage: `url(${optimizedSrc})`,
        clipPath: 'inset(0 0 0 50%)',
        backgroundSize: 'contain'
      }"
    ></div>
    
    <!-- Divider line -->
    <div 
      ref="divider" 
      class="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-10 shadow-lg"
      style="left: 50%;"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
    >
      <!-- Divider handle -->
      <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
        <i class="fas fa-arrows-alt-h text-blue-600"></i>
      </div>
      
      <!-- Labels moved to sides of container -->
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
</template>
