<template>
  <div 
    class="flex mb-2"
    :class="isOwn ? 'justify-end' : 'justify-start'"
  >
    <div 
      class="max-w-[80%] rounded-3xl px-4 py-3 break-words"
      :class="messageClasses"
    >
      <div class="text-left message-content">
        <div v-html="formattedContent"></div>
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

// Format the content with proper line breaks and cursor
const formattedContent = computed(() => {
  let content = props.message.content || '';
  
  // Replace line breaks with <br> tags
  content = content.replace(/\n/g, '<br>');
  
  // Add cursor if streaming
  if (props.message.isStreaming) {
    content += '<span class="cursor"></span>';
  }
  
  return content;
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

<style>
/* Message content styling */
.message-content {
  position: relative;
  line-height: 1.5;
}

/* Cursor animation like Gemini */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: currentColor;
  margin-left: 1px;
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}

/* Ensure smooth text rendering */
.message-content div {
  word-break: break-word;
}
</style>