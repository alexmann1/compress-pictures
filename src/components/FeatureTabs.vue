<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['tab-change']);

// Active tab tracker
const activeTab = ref('resize');

// Switch tabs
const switchTab = (tab) => {
  activeTab.value = tab;
  emit('tab-change', tab);
};
</script>

<template>
  <div class="mb-6">
    <div class="flex border-b border-gray-300 dark:border-gray-600 mb-4">
      <button 
        @click="switchTab('resize')" 
        :class="['px-4 py-2 font-medium', activeTab === 'resize' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-600 dark:text-gray-400']"
      >
        <i class="fas fa-compress-arrows-alt mr-2"></i>Resize
      </button>
      <button 
        @click="switchTab('format')" 
        :class="['px-4 py-2 font-medium', activeTab === 'format' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-600 dark:text-gray-400']"
      >
        <i class="fas fa-crop-alt mr-2"></i>Format
      </button>
      <button 
        @click="switchTab('convert')" 
        :class="['px-4 py-2 font-medium', activeTab === 'convert' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-600 dark:text-gray-400']"
      >
        <i class="fas fa-exchange-alt mr-2"></i>Convert
      </button>
    </div>
    
    <!-- Tab Content -->
    <slot :active-tab="activeTab"></slot>
  </div>
</template>
