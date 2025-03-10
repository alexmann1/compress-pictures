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

const emit = defineEmits(['format-change', 'crop-image-ready']);

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
  
  // Create a wrapper function that preserves access to all reactive variables
  const boundCropImageFunction = () => {
    return cropImageToFormat();
  };
  
  // Expose the crop function to parent component
  emit('crop-image-ready', boundCropImageFunction);
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

// Crop image based on selected aspect ratio and current position
const cropImageToFormat = async () => {
  // Use props.originalImage directly to avoid context issues when called from other components
  if (!props.originalImage || !props.formatState || !props.formatState.ratio) {
    // If no image/ratio, return the original image
    return props.originalImage ? props.originalImage.url : null;
  }
   
  return new Promise((resolve) => {
    // Direct cropping approach that doesn't rely on DOM elements
    // This allows the function to work when called from other components
    
    // Create a new image to work with
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        // Create a canvas with the correct aspect ratio
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Parse aspect ratio
        const [targetWidth, targetHeight] = props.formatState.ratio.split(':').map(Number);
        const targetRatio = targetWidth / targetHeight;
                
        // Set output dimensions (use standard social media size)
        let outputWidth, outputHeight;
        
        // Handle different aspect ratios with appropriate resolutions
        if (props.formatState.ratio === '1:1') { // Square
          outputWidth = outputHeight = 1080;
        } else if (props.formatState.ratio === '9:16') { // Portrait/Story
          outputWidth = 1080;
          outputHeight = 1920;
        } else if (props.formatState.ratio === '16:9') { // Landscape
          outputWidth = 1920;
          outputHeight = 1080;
        } else if (props.formatState.ratio === '4:5') { // Instagram portrait
          outputWidth = 1080;
          outputHeight = 1350;
        } else if (props.formatState.ratio === '2:3') { // Pinterest
          outputWidth = 1000;
          outputHeight = 1500;
        } else {
          // Default calculation for other ratios
          outputWidth = 1080; 
          outputHeight = Math.round(outputWidth / targetRatio);
        }
        
        // Set canvas size to match the desired aspect ratio
        canvas.width = outputWidth;
        canvas.height = outputHeight;
               
        // Use the original image dimensions directly instead of DOM elements
        // This allows the function to work when called from other components
        
        // Get the original image aspect ratio
        const originalRatio = props.originalImage.width / props.originalImage.height;
        
        // Calculate the scale factor to map position coordinates to original image
        // Since position is already in original image coordinates, scale is 1:1
        const scaleX = 1;
        const scaleY = 1;
        
        // Calculate the crop dimensions based on the target aspect ratio
        let cropWidth, cropHeight;
        
        // Determine crop dimensions based on original image and target ratio
        if (targetRatio > originalRatio) {
          // Target is wider than original - constrained by width
          cropWidth = img.width;
          cropHeight = cropWidth / targetRatio;
        } else {
          // Target is taller than original - constrained by height
          cropHeight = img.height;
          cropWidth = cropHeight * targetRatio;
        }
        
        // Calculate the maximum possible crop dimensions that fit within the image
        if (cropWidth > img.width) {
          cropWidth = img.width;
          cropHeight = cropWidth / targetRatio;
        }
        if (cropHeight > img.height) {
          cropHeight = img.height;
          cropWidth = cropHeight * targetRatio;
        }
        
        // Apply user's drag position (scaled from UI to original image coordinates)
        // Ensure position stays within image bounds
        const positionX = props.formatState.position.x * scaleX;
        const positionY = props.formatState.position.y * scaleY;
        
        // Calculate the source rectangle coordinates
        let sourceX = (img.width - cropWidth) / 2 - positionX;
        let sourceY = (img.height - cropHeight) / 2 - positionY;
        
        // Ensure the crop stays within the image boundaries
        sourceX = Math.max(0, Math.min(sourceX, img.width - cropWidth));
        sourceY = Math.max(0, Math.min(sourceY, img.height - cropHeight));
                
        // Fill the canvas with black background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the cropped portion to the canvas with the proper dimensions
        ctx.drawImage(
          img,
          sourceX, sourceY, cropWidth, cropHeight,
          0, 0, canvas.width, canvas.height
        );
        
        // Return the cropped image as data URL with good quality
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (error) {
        console.error('Error cropping image:', error);
        resolve(props.originalImage.url); // Fallback to original image
      }
    };
    
    // Use the original image for the crop
    img.src = props.originalImage.url;
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
