<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  originalImage: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['format-selected']);

// Available formats
const formats = [
  { id: 'jpg', name: 'JPG', mime: 'image/jpeg', description: 'Best for photos' },
  { id: 'png', name: 'PNG', mime: 'image/png', description: 'Supports transparency' },
  { id: 'webp', name: 'WebP', mime: 'image/webp', description: 'Modern web format' },
  { id: 'gif', name: 'GIF', mime: 'image/gif', description: 'Simple animations' },
  { id: 'svg', name: 'SVG', mime: 'image/svg+xml', description: 'Vector graphics' }
];

// Currently selected format
const selectedFormat = ref('jpg');

// Determine if the current image is an SVG
const isSvg = ref(false);

// Initialize component
onMounted(() => {
  // Check if the current image is an SVG
  if (props.originalImage && props.originalImage.type === 'image/svg+xml') {
    isSvg.value = true;
    // Default to PNG for SVG conversions (common use case)
    selectedFormat.value = 'png';
  } else {
    // Set initial format based on the original image type
    const imageType = props.originalImage?.type || '';
    if (imageType.includes('png')) selectedFormat.value = 'png';
    else if (imageType.includes('webp')) selectedFormat.value = 'webp';
    else if (imageType.includes('gif')) selectedFormat.value = 'gif';
    else if (imageType.includes('svg')) selectedFormat.value = 'svg';
    else selectedFormat.value = 'jpg'; // Default to JPG
  }
  
  // Emit initial format
  emit('format-selected', selectedFormat.value);
});

// Handle format change
const handleFormatChange = (format) => {
  selectedFormat.value = format;
  emit('format-selected', format);
};

// Determine if a format is available based on the original image
const isFormatAvailable = (format) => {
  // SVG to raster is possible, but raster to SVG is not supported
  if (format === 'svg' && !isSvg.value) {
    return false;
  }
  return true;
};

// Get description for conversion from current format
const getConversionDescription = (format) => {
  // Get the current format info
  const currentFormat = formats.find(f => f.id === selectedFormat.value);
  
  // Get target format info
  const targetFormat = formats.find(f => f.id === format);
  
  if (!currentFormat || !targetFormat) return '';
  
  // Return format-specific descriptions
  if (format === selectedFormat.value) {
    return `Keep as ${targetFormat.name}`;
  }
  
  // Special cases for different conversions
  if (isSvg.value && format !== 'svg') {
    return `Convert from vector to ${targetFormat.name}`;
  }
  
  return targetFormat.description;
};
</script>

<template>
  <div class="convert-container h-full flex flex-col">
    <!-- Preview of the image to be converted -->
    <div class="image-preview flex-grow bg-slate-200 dark:bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden relative">
      <img 
        :src="originalImage.url" 
        :alt="'Original image in ' + originalImage.type" 
        class="max-w-full object-contain max-h-[650px]"
      />
      
      <!-- Format overlay -->
      <div class="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
        {{ formats.find(f => f.id === selectedFormat)?.name || 'Unknown' }}
      </div>
    </div>
    
    <!-- Format selection tiles 
    <div class="format-selection mt-4 grid grid-cols-3 gap-2">
      <button
        v-for="format in formats"
        :key="format.id"
        :disabled="!isFormatAvailable(format.id)"
        :class="[
          'format-tile p-3 rounded-lg transition-colors text-left',
          selectedFormat === format.id 
            ? 'bg-blue-600 text-white' 
            : (isFormatAvailable(format.id) 
                ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed')
        ]"
        @click="isFormatAvailable(format.id) && handleFormatChange(format.id)"
      >
        <div class="font-semibold mb-1">{{ format.name }}</div>
        <div class="text-xs">{{ getConversionDescription(format.id) }}</div>
      </button>
    </div>-->
  </div>
</template>

<style scoped>
.convert-container {
  min-height: 400px;
}
</style>
