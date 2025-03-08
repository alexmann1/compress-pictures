<script setup>
import { ref } from 'vue'

const emit = defineEmits(['image-uploaded'])

const isDragging = ref(false)
const inputRef = ref(null)

const handleDragEnter = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
}

const handleDragOver = (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (!isDragging.value) {
    isDragging.value = true
  }
}

const handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
  
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0])
  }
}

const handleFileInput = (e) => {
  if (e.target.files && e.target.files[0]) {
    handleFile(e.target.files[0])
  }
}

const handleFile = (file) => {
  // Define supported image formats
  const supportedFormats = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  
  // Validate file is a supported image format
  if (!supportedFormats.includes(file.type)) {
    alert('Unsupported image format. Please select a JPG, PNG, GIF, WebP, or SVG file.')
    return
  }
  
  // Emit the file to parent component
  emit('image-uploaded', file)
}

const triggerFileInput = () => {
  inputRef.value.click()
}
</script>

<template>
  <div 
    class="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
           dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500"
    :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDragging }"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @click="triggerFileInput"
  >
    <input 
      type="file" 
      ref="inputRef"
      class="hidden" 
      accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" 
      @change="handleFileInput"
    />
    
    <div class="py-12">
      <i class="fas fa-cloud-upload-alt text-5xl mb-4 text-blue-500"></i>
      
      <h3 class="text-xl font-medium mb-2">Drag & Drop your image here</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">or click to browse your files</p>
      
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        <i class="fas fa-upload mr-2"></i> Select Image
      </button>
      
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Supported formats: JPG, PNG, GIF, WebP, SVG
      </p>
    </div>
  </div>
</template>
