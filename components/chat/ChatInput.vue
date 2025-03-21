<template>
  <div class="border-t border-gray-200 p-3 bg-white">
    <div class="flex items-end gap-2">
      <!-- Attachment button -->
      <button class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>
      
      <!-- Emoji button -->
      <button class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      <!-- Input field -->
      <div class="flex-1 relative">
        <textarea
          v-model="messageText"
          @keydown.enter.prevent="handleEnterKey"
          placeholder="Type a message..."
          class="w-full py-3 px-4 rounded-3xl resize-none border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors min-h-[50px] max-h-[120px] overflow-auto"
          rows="1"
          ref="textareaRef"
        ></textarea>
      </div>
      
      <!-- Send button -->
      <button 
        @click="sendMessage"
        class="p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white"
        :disabled="!messageText.trim()"
        :class="{ 'opacity-50 cursor-not-allowed': !messageText.trim() }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const emit = defineEmits(['send-message']);
const messageText = ref('');
const textareaRef = ref(null);

// Function to send a message
const sendMessage = () => {
  if (messageText.value.trim()) {
    emit('send-message', messageText.value);
    messageText.value = '';
    // Reset textarea height
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto';
    }
  }
};

// Handle Enter key to send the message (Shift+Enter for new line)
const handleEnterKey = (event) => {
  if (!event.shiftKey) {
    sendMessage();
  }
};

// Auto-resize textarea based on content
const resizeTextarea = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

// Watch for changes in message text to resize textarea
watch(messageText, resizeTextarea);

onMounted(() => {
  // Focus the textarea when component is mounted
  if (textareaRef.value) {
    textareaRef.value.focus();
  }
});
</script>