<template>
  <div class="flex flex-col h-[600px] w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
    <!-- Chat header -->
    <div class="flex items-center p-4 border-b border-gray-200 bg-white">
      <div class="relative mr-3">
        <img 
          :src="activeChat.avatar" 
          :alt="activeChat.name" 
          class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
        >
        <span 
          class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
          :class="activeChat.isOnline ? 'bg-green-500' : 'bg-gray-400'"
        ></span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800">{{ activeChat.name }}</h3>
        <p class="text-sm text-gray-500">
          {{ activeChat.isOnline ? 'Online' : formatLastSeen(activeChat.lastSeen) }}
        </p>
      </div>
      <div class="flex space-x-3">
        <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Chat messages area -->
    <div class="flex-1 p-4 overflow-y-auto bg-gray-50" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="message.id || index" class="mb-4 message-container">
        <ChatMessage 
          :message="message" 
          :isOwn="message.senderId === currentUser.id" 
        />
      </div>
    </div>
    
    <!-- Chat input -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useChat } from '~/composables/useChat';
import ChatMessage from './ChatMessage.vue';

// Mock data for the current user
const currentUser = ref({
  id: 1,
  name: 'Current User',
  avatar: 'https://i.pravatar.cc/150?img=1'
});

// Mock data for the active chat
const activeChat = ref({
  id: 2,
  name: 'Claude 3.7',
  avatar: 'https://i.pravatar.cc/150?img=2',
  isOnline: true,
  lastSeen: new Date()
});

// Use our chat composable
const { isLoading, error, sendMessage: sendChatMessage, processStream } = useChat();

// Message input text
const messageText = ref('');
const textareaRef = ref(null);

// Mock messages data
const messages = ref([
  {
    id: 1,
    content: 'Hey there! How are you doing today?',
    timestamp: new Date(Date.now() - 3600000),
    senderId: 2,
    status: 'read'
  },
  {
    id: 2,
    content: 'I\'m doing great, thanks for asking! How about you?',
    timestamp: new Date(Date.now() - 3000000),
    senderId: 1,
    status: 'read'
  },
  {
    id: 3,
    content: 'Pretty good! Just working on this new project. It\'s coming along nicely.',
    timestamp: new Date(Date.now() - 2400000),
    senderId: 2,
    status: 'read'
  },
  {
    id: 4,
    content: 'That sounds interesting! What kind of project is it?',
    timestamp: new Date(Date.now() - 1800000),
    senderId: 1,
    status: 'read'
  },
  {
    id: 5,
    content: 'It\'s a web application with a modern chat interface, similar to Facebook Messenger.',
    timestamp: new Date(Date.now() - 1200000),
    senderId: 2,
    status: 'read'
  },
  {
    id: 6,
    content: 'That sounds awesome! I\'d love to see it when it\'s ready.',
    timestamp: new Date(Date.now() - 600000),
    senderId: 1,
    status: 'delivered'
  }
]);

const messagesContainer = ref(null);

// Function to format the last seen time
const formatLastSeen = (date) => {
  if (!date) return 'Offline';
  
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

// Format the timestamp to a readable time
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Function to send a new message
const sendMessage = async () => {
  if (!messageText.value.trim()) return;
  
  // Create and add the user message
  const newMessage = {
    id: messages.value.length + 1,
    content: messageText.value,
    timestamp: new Date(),
    senderId: currentUser.value.id,
    status: 'sent'
  };
  
  // Add the user message
  messages.value.push(newMessage);
  messageText.value = '';
  
  // Reset textarea height
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
  
  // Immediately create and add a placeholder for the assistant's response
  const assistantMessage = {
    id: messages.value.length + 1,
    content: '',
    timestamp: new Date(),
    senderId: activeChat.value.id,
    status: 'typing',
    isStreaming: true
  };
  
  // Add the placeholder message immediately
  messages.value.push(assistantMessage);
  
  // Ensure the UI updates before making the API call
  await nextTick();
  
  // Prepare the messages for the API in Anthropic format
  const apiMessages = [];
  for (const msg of messages.value) {
    // Skip the placeholder message
    if (msg.id === assistantMessage.id) continue;
    
    apiMessages.push({
      role: msg.senderId === currentUser.value.id ? 'user' : 'assistant',
      content: msg.content
    });
  }
  
  try {
    // Call the API with streaming
    const response = await sendChatMessage(apiMessages, true);
    
    // Process the streaming response
    await processStream(
      response,
      // On content
      (content) => {
        // Simple, direct update for better performance
        const index = messages.value.findIndex(msg => msg.id === assistantMessage.id);
        if (index !== -1) {
          // Create a new object to trigger Vue reactivity
          const updatedMessage = { ...messages.value[index] };
          
          // Ensure content is initialized and append new content
          updatedMessage.content = (updatedMessage.content || '') + content;
          
          // Replace the message in the array to trigger reactivity
          messages.value.splice(index, 1, updatedMessage);
          
          // Force a reactive update by also updating the reference
          assistantMessage.content = updatedMessage.content;
          
          // Debug: log content updates
          console.log(`Updated content: "${updatedMessage.content.substring(0, 50)}${updatedMessage.content.length > 50 ? '...' : ''}"`);
        } else {
          // Fallback to direct modification if message not found
          assistantMessage.content = (assistantMessage.content || '') + content;
          console.log(`Fallback update: "${assistantMessage.content.substring(0, 50)}${assistantMessage.content.length > 50 ? '...' : ''}"`);
        }
      },
      // On done
      () => {
        assistantMessage.isStreaming = false;
        assistantMessage.status = 'delivered';
      },
      // On error
      (errorMsg) => {
        console.error('API error:', errorMsg);
        assistantMessage.content = 'Sorry, an error occurred while generating a response.';
        assistantMessage.isStreaming = false;
        assistantMessage.status = 'error';
      }
    );
  } catch (err) {
    console.error('API call error:', err);
    assistantMessage.content = 'Sorry, an error occurred while connecting to the server.';
    assistantMessage.isStreaming = false;
    assistantMessage.status = 'error';
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

// Improved scroll behavior for streaming messages
const scrollToBottom = (smooth = true) => {
  if (messagesContainer.value) {
    nextTick(() => {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    });
  }
};

// Scroll when messages are added
watch(messages, () => {
  scrollToBottom();
}, { deep: true, immediate: true });

// Also watch for content changes in the last message to ensure smooth scrolling during streaming
watch(() => {
  if (messages.value.length > 0) {
    return messages.value[messages.value.length - 1].content;
  }
  return null;
}, () => {
  scrollToBottom(true);
});

onMounted(() => {
  // Focus the textarea when component is mounted
  if (textareaRef.value) {
    textareaRef.value.focus();
  }
  
  // Scroll to bottom of messages on initial load
  scrollToBottom(false);
});
</script>

<style scoped>
/* New message animation similar to Gemini */
.message-container {
  transition: opacity 0.3s ease;
}

.message-container:last-child {
  opacity: 1;
}

/* Optimized scrolling for the messages container */
.overflow-y-auto {
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  padding-bottom: 10px;
}

/* Improved spacing for better readability */
.mb-4:not(:last-child) {
  margin-bottom: 1.5rem;
}
</style>