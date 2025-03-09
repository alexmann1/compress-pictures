<template>
  <div class="h-full">
    <div class="p-4 bg-gray-100 dark:bg-gray-800 h-full flex flex-col">

      <!-- Formatted image container with fixed dimensions -->
      <div class="flex-grow flex flex-col">
        <div class="relative mx-auto flex items-center justify-center w-full max-h-[650px]">
          <div 
            class="relative border-4 border-green-500 overflow-hidden flex items-center justify-center bg-black"
            :style="{
              aspectRatio: localState.ratio.replace(':', '/'),
              maxWidth: '100%',
              maxHeight: '100%'
            }">
            <div 
              class="w-full h-full cursor-move relative"
              @mousedown="startDrag"
              @touchstart="startDrag"
            >
              <img 
                v-if="originalImage && originalImage.url"
                :src="originalImage.url" 
                alt="Formatted image" 
                class="w-full h-full object-cover"
                ref="imageRef"
                :style="{
                  objectPosition: `calc(50% + ${position.x}px) calc(50% + ${position.y}px)`
                }"
                @load="updateImageDimensions"
              />
              <div class="absolute top-0 left-0 w-full h-full flex items-end justify-center pointer-events-none">
                <div class="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                  
                  Drag to position
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, watch, onMounted, computed } from 'vue';

const props = defineProps({
  originalImage: Object,
  formatState: Object
});

const emit = defineEmits(['format-change']);

// Image references and state
const imageRef = ref(null);
const imageLoaded = ref(false);
const isDragging = ref(false);
const startPos = ref({ x: 0, y: 0 });
const imgWidth = ref(0);
const imgHeight = ref(0);

// Create local reactive state to avoid modifying props directly
const localState = reactive({
  platform: props.formatState?.platform || 'instagram',
  ratio: props.formatState?.ratio || '1:1',
  position: {
    x: props.formatState?.position?.x || 0,
    y: props.formatState?.position?.y || 0
  }
});

// Extract refs for template use
const { position } = toRefs(localState);

// Social media platforms with Font Awesome icons
const platforms = [
  { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram' },
  { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook' },
  { id: 'twitter', name: 'X', icon: 'fab fa-twitter' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin' },
  { id: 'youtube', name: 'YouTube', icon: 'fab fa-youtube' },
  { id: 'pinterest', name: 'Pinterest', icon: 'fab fa-pinterest' }
];

// Format options organized by platform
const formatOptions = {
  instagram: [
    { id: '1:1', name: 'Square', resolution: '1080×1080' },
    { id: '4:5', name: 'Portrait', resolution: '1080×1350' },
    { id: '9:16', name: 'Story', resolution: '1080×1920' }
  ],
  facebook: [
    { id: '1:1', name: 'Square', resolution: '1200×1200' },
    { id: '16:9', name: 'Landscape', resolution: '1200×675' }
  ],
  twitter: [
    { id: '16:9', name: 'Landscape', resolution: '1200×675' },
    { id: '1:1', name: 'Square', resolution: '1200×1200' }
  ],
  linkedin: [
    { id: '1:1', name: 'Square', resolution: '1200×1200' },
    { id: '16:9', name: 'Landscape', resolution: '1200×627' }
  ],
  youtube: [
    { id: '16:9', name: 'Thumbnail', resolution: '1280×720' }
  ],
  pinterest: [
    { id: '2:3', name: 'Pin', resolution: '1000×1500' },
    { id: '1:1', name: 'Square', resolution: '1000×1000' }
  ]
};

// Computed property to filter ratios based on selected platform
const filteredRatios = computed(() => {
  return formatOptions[localState.platform] || [];
});

// Initialize component
onMounted(() => {
  // Preload the image to ensure it's in browser cache
  if (props.originalImage && props.originalImage.url) {
    const preloadImg = new Image();
    preloadImg.src = props.originalImage.url;
  }
  
  // Initialize position from props
  if (props.formatState && props.formatState.position) {
    localState.position.x = props.formatState.position.x || 0;
    localState.position.y = props.formatState.position.y || 0;
  }
});

// Handle successful image load
const onImageLoad = (event) => {
  imageLoaded.value = true;
  updateImageDimensions(event);
};

// Update image dimensions when image loads or changes
const updateImageDimensions = (event) => {
  if (event.target) {
    imgWidth.value = event.target.naturalWidth;
    imgHeight.value = event.target.naturalHeight;
  } else if (imageRef.value) {
    imgWidth.value = imageRef.value.naturalWidth;
    imgHeight.value = imageRef.value.naturalHeight;
  }
};

// Handle image load error
const onImageError = () => {
  imageLoaded.value = false;
};

// Platform selection handler
const selectPlatform = (platformId) => {
  localState.platform = platformId;
  
  // If current ratio isn't available in the new platform, select the first available
  const availableRatios = formatOptions[platformId].map(r => r.id);
  if (!availableRatios.includes(localState.ratio)) {
    localState.ratio = availableRatios[0];
  }
  
  // Emit change event
  emitFormatChange();
};

// Ratio selection handler
const selectRatio = (ratioId) => {
  console.log('ImageFormatMode - Ratio selected:', ratioId);
  console.log('ImageFormatMode - Current ratio before change:', localState.ratio);
  localState.ratio = ratioId;
  console.log('ImageFormatMode - Current ratio after change:', localState.ratio);
  emitFormatChange();
};

// Image dragging handlers
const startDrag = (event) => {
  // Prevent default to avoid text selection during drag
  event.preventDefault();
  
  isDragging.value = true;
  
  // Normalize touch vs mouse events
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  
  startPos.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  };
  
  // Add event listeners for drag and end
  window.addEventListener('mousemove', onDrag, { passive: false });
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);
  
  // Add cursor styling
  document.body.style.cursor = 'move';
};

const onDrag = (event) => {
  if (!isDragging.value) return;
  
  // Prevent default to stop scrolling on touch devices
  event.preventDefault();
  
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  
  // Calculate raw movement from start position
  const rawX = clientX - startPos.value.x;
  const rawY = clientY - startPos.value.y;
  
  // Get natural dimensions of the image
  if (imageRef.value && imgWidth.value && imgHeight.value) {
    // Get containers
    const container = imageRef.value.closest('.relative');
    if (!container) return;
    
    // Get aspect ratio of the image
    const imgRatio = imgWidth.value / imgHeight.value;
    
    // Get container dimensions
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const containerRatio = containerWidth / containerHeight;
    
    // Calculate how much of the image is visible
    let visibleImgWidth, visibleImgHeight;
    
    if (imgRatio > containerRatio) {
      // Image is wider than container ratio
      visibleImgHeight = containerHeight;
      visibleImgWidth = visibleImgHeight * imgRatio;
    } else {
      // Image is taller than container ratio
      visibleImgWidth = containerWidth;
      visibleImgHeight = visibleImgWidth / imgRatio;
    }
    
    // Calculate maximum drag amounts in each direction
    const maxDragX = Math.max(0, (visibleImgWidth - containerWidth) / 2);
    const maxDragY = Math.max(0, (visibleImgHeight - containerHeight) / 2);
    
    // Apply constraints
    position.value.x = Math.max(-maxDragX, Math.min(maxDragX, rawX));
    position.value.y = Math.max(-maxDragY, Math.min(maxDragY, rawY));
  }
};

const endDrag = () => {
  if (!isDragging.value) return;
  
  isDragging.value = false;
  
  // Remove event listeners
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('mouseup', endDrag);
  window.removeEventListener('touchend', endDrag);
  
  // Reset cursor
  document.body.style.cursor = '';
  
  // Final emit
  emitFormatChange();
};

// Emit changes to parent component
const emitFormatChange = () => {
  emit('format-change', {
    platform: localState.platform,
    ratio: localState.ratio,
    position: {
      x: position.value.x,
      y: position.value.y
    }
  });
};

// Watch for external changes to the format state
watch(() => props.formatState, (newState) => {
  if (newState) {
    localState.platform = newState.platform || localState.platform;
    localState.ratio = newState.ratio || localState.ratio;
    
    if (newState.position) {
      localState.position.x = newState.position.x;
      localState.position.y = newState.position.y;
    }
  }
}, { deep: true });
</script>
