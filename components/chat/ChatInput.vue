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
      <div class="relative">
        <button 
          @click="toggleEmojiPicker" 
          class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <!-- Emoji picker dropdown -->
        <div v-if="showEmojiPicker" class="absolute bottom-12 left-0 z-50 bg-white rounded-lg shadow-lg p-2 border border-gray-200 w-64 grid grid-cols-8 gap-1 max-h-[300px] overflow-y-auto">
          <button 
            v-for="emoji in commonEmojis" 
            :key="emoji"
            @click="insertEmoji(emoji)"
            class="emoji-btn p-1 text-xl hover:bg-gray-100 rounded"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
      
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
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';

const emit = defineEmits(['send-message']);
const messageText = ref('');
const textareaRef = ref(null);
const showEmojiPicker = ref(false);

// Common emojis list
const commonEmojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
  '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞',
  '🫶', '❤️', '🔥', '👍', '👎', '👏', '🙌', '🤝', '🙏', '💯'
];

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

// Toggle emoji picker visibility
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
  
  // Add click outside listener when picker is shown
  if (showEmojiPicker.value && process.client) {
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 0);
  }
};

// Insert emoji at cursor position
const insertEmoji = (emoji) => {
  if (!textareaRef.value) return;
  
  const textarea = textareaRef.value;
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  
  // Insert emoji at cursor position
  messageText.value = 
    messageText.value.substring(0, startPos) + 
    emoji + 
    messageText.value.substring(endPos);
  
  // Set cursor position after the inserted emoji
  setTimeout(() => {
    textarea.focus();
    textarea.selectionStart = startPos + emoji.length;
    textarea.selectionEnd = startPos + emoji.length;
  }, 0);
  
  // Hide emoji picker after selection
  showEmojiPicker.value = false;
};

// Handle clicks outside the emoji picker
const handleOutsideClick = (event) => {
  // Check if the click was outside the emoji picker and button
  if (!event.target.closest('.emoji-btn') && !event.target.closest('button')) {
    showEmojiPicker.value = false;
    document.removeEventListener('click', handleOutsideClick);
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

// Clean up event listeners
onBeforeUnmount(() => {
  if (process.client) {
    document.removeEventListener('click', handleOutsideClick);
  }
});

onMounted(() => {
  // Focus the textarea when component is mounted
  if (textareaRef.value) {
    textareaRef.value.focus();
  }
});
</script>

<style>
.emoji-btn {
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.emoji-btn:hover {
  background-color: #f3f4f6;
}

.emoji-btn:active {
  background-color: #e5e7eb;
}
</style>