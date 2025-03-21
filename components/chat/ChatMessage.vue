<template>
  <div 
    class="flex mb-2"
    :class="isOwn ? 'justify-end' : 'justify-start'"
  >
    <div 
      class="max-w-[80%] rounded-3xl px-4 py-3 break-words"
      :class="messageClasses"
    >
      <p>{{ message.content }}</p>
      <div 
        class="text-xs mt-1 flex items-center justify-end"
        :class="isOwn ? 'text-white/70' : 'text-gray-500'"
      >
        {{ formatTime(message.timestamp) }}
        <span v-if="isOwn" class="ml-1">
          <!-- Message status icon -->
          <svg v-if="message.status === 'sent'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="message.status === 'delivered'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="message.status === 'read'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isOwn: {
    type: Boolean,
    default: false
  }
});

// Compute classes for message bubble based on whether it's the user's message or not
const messageClasses = computed(() => {
  return props.isOwn 
    ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
    : 'bg-gray-200 text-gray-800 rounded-bl-none shadow';
});

// Format the timestamp to a readable time
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>