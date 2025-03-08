<script setup>
const props = defineProps({
  isDark: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle'])

const toggleTheme = () => {
  emit('toggle')
}
</script>

<template>
  <button 
    @click="toggleTheme"
    class="p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
    title="Toggle theme"
  >
    <i 
      :class="['text-xl', isDark ? 'fas fa-sun text-yellow-400' : 'fas fa-moon text-blue-800']"
    ></i>
  </button>
</template>
