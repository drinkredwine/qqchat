<template>
  <div 
    class="flex mb-2"
    :class="isOwn ? 'justify-end' : 'justify-start'"
  >
    <div 
      class="max-w-[80%] rounded-3xl px-4 py-3 break-words"
      :class="messageClasses"
    >
      <div class="text-left">
        <span v-if="message.content">{{ message.content }}</span>
        <transition-group 
          name="fade-chunk" 
          tag="span"
          class="inline"
        >
          <span 
            v-if="message.isStreaming && !message.content" 
            key="empty-placeholder"
            class="inline-block min-w-[8px] animate-pulse-slow"
          >▋</span>
          <span 
            v-else-if="message.isStreaming" 
            key="typing-indicator" 
            class="inline-block min-w-[8px] animate-pulse-slow"
          >▋</span>
        </transition-group>
      </div>
      <div 
        class="text-xs mt-1 flex items-center"
        :class="isOwn ? 'text-white/70 justify-end' : 'text-gray-500 justify-start'"
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
import { computed, ref, watch } from 'vue';

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

// Keep track of the latest content chunk for animation
const latestChunk = ref('');
const previousContent = ref('');

// Watch for content changes to animate new chunks
watch(() => props.message.content, (newContent, oldContent) => {
  if (newContent && oldContent !== undefined) {
    // Get only the new chunk that was added
    const newChunk = newContent.slice(oldContent?.length || 0);
    if (newChunk) {
      latestChunk.value = newChunk;
      // Reset after animation completes
      setTimeout(() => {
        previousContent.value = newContent;
      }, 50);
    }
  }
}, { immediate: true });

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

<style scoped>
/* Fade-in animation for new content chunks */
.fade-chunk-enter-active {
  transition: all 0.3s ease;
}
.fade-chunk-leave-active {
  transition: all 0.2s ease;
}
.fade-chunk-enter-from, 
.fade-chunk-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* Smoother pulse animation for the cursor */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
.animate-pulse-slow {
  animation: pulse-slow 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>