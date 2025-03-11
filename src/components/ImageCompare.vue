<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';

const props = defineProps({
  originalSrc: {
    type: String,
    required: true
  },
  optimizedSrc: {
    type: String,
    required: true
  },
  sliderPosition: {
    type: Number,
    default: 50
  },
  isProcessing: {
    type: Boolean,
    default: false
  },
  aspectRatio: {
    type: String,
    default: '1:1'
  },
  showComparison: {
    type: Boolean,
    default: true
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

// Watch for changes in aspect ratio or comparison mode
watch(
  () => [props.aspectRatio, props.showComparison], 
  () => {
    // Force re-render when these props change
    if (!props.showComparison) {
      // In format mode, make sure the aspect ratio is applied
      nextTick(() => {
        // Ensure the component updates with the new aspect ratio
        console.log('Format mode:', props.aspectRatio);
      });
    } else {
      // In comparison mode, reset the slider
      nextTick(() => {
        updateSliderPosition(50);
      });
    }
  }
);

// Reset slider position when images change or when switching modes
watch(() => [props.originalSrc, props.optimizedSrc, props.showComparison], () => {
  if (props.showComparison) {
    updateSliderPosition(props.sliderPosition);
  }
});

// Watch for changes in sliderPosition from parent
watch(() => props.sliderPosition, (newValue) => {
  if (props.showComparison) {
    updateSliderPosition(newValue);
  }
});

// Watch for changes in props
watch(() => props.originalSrc, (newValue) => {
  console.log('Original image URL changed:', newValue);
});

watch(() => props.optimizedSrc, (newValue) => {
  console.log('Optimized image URL changed:', newValue);
});

// Set initial slider position on mounted and when switching modes
onMounted(() => {
  if (props.showComparison) {
    updateSliderPosition(props.sliderPosition);
  }
});

// Watch for changes in showComparison to update UI accordingly
watch(() => props.showComparison, (newVal) => {
  // When switching back to comparison mode, ensure slider is visible
  if (newVal === true) {
    updateSliderPosition(props.sliderPosition);
  }
});
</script>

<template>
  <div 
    ref="container" 
    class="relative w-full h-full overflow-hidden rounded-lg bg-slate-200 dark:bg-gray-700"
    :class="{ 'min-h-[650px]': showComparison }"
  >
    <!-- Loading indicator -->
    <div 
      v-if="isProcessing" 
      class="absolute inset-0 flex items-center justify-center bg-slate-400 dark:bg-gray-700 z-20"
    >
      <i class="fas fa-spinner fa-spin text-3xl"></i>
    </div>
    
    <!-- Comparison Mode -->
    <div v-if="showComparison" class="relative w-full h-full flex items-center justify-center">
      <!-- Original image (background) -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div 
          class="relative overflow-hidden w-full h-full bg-contain bg-center bg-no-repeat" 
          :style="{ 
            backgroundImage: originalSrc ? `url(${originalSrc})` : 'none'
          }"
        >
          <!-- Optimized image (foreground with clip) -->
          <div 
            ref="optimizedImageEl"
            class="absolute inset-0 bg-contain bg-center bg-no-repeat optimized-image" 
            :style="{ 
              backgroundImage: optimizedSrc ? `url(${optimizedSrc})` : 'none',
              clipPath: `inset(0 0 0 ${sliderPosition}%)`,
              backgroundSize: 'contain'
            }"
          ></div>
        </div>
      </div>
      
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
      </div>
      
      <!-- Original label (left side) -->
      <div class="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
        Original
      </div>
      
      <!-- Optimized label (right side) -->
      <div class="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
        Optimized
      </div>
      
      <!-- Aspect ratio indicator -->
      <div class="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
        {{ aspectRatio }}
      </div>
    </div>
    
    <!-- Format Mode (Single Image) -->
    <div v-else class="relative w-full h-full flex items-center justify-center">
      <!-- Single image with aspect ratio applied -->
      <img 
        :src="originalSrc"
        class="max-h-full max-w-full" 
        :style="{ 
          aspectRatio: aspectRatio ? aspectRatio.replace(':', '/') : 'auto',
        }"
      />
      
      <!-- Format label -->
      <div class="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
        Format: {{ aspectRatio }}
      </div>
      
      <!-- Aspect ratio indicator -->
      <div class="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
        {{ aspectRatio }}
      </div>
    </div>
  </div>
</template>
