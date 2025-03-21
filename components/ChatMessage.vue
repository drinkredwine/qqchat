<template>
  <div class="mb-4" :class="{ 'flex justify-end': isOwn }">
    <div 
      class="max-w-[80%] px-4 py-3 rounded-2xl shadow-sm"
      :class="[
        isOwn 
          ? 'bg-blue-500 text-white rounded-tr-none' 
          : 'bg-gray-200 text-gray-800 rounded-tl-none'
      ]"
    >
      <div v-if="!isOwn" class="font-medium text-xs text-gray-600 mb-1">{{ message.sender }}</div>
      <p class="text-base">{{ message.text }}</p>
      <div class="text-xs mt-1 text-right" :class="isOwn ? 'text-blue-100' : 'text-gray-500'">
        {{ message.time }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      sender: '',
      text: '',
      time: '',
      isOwn: false
    })
  },
  isOwn: {
    type: Boolean,
    default: false
  }
});
</script>