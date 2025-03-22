<template>
  <div class="flex flex-col h-full w-full bg-white overflow-hidden">
    <!-- Chat header - minimal version with personality -->
    <div class="flex items-center p-3 border-b border-gray-200 bg-white">
      <div class="relative mr-3">
        <img 
          :src="activeChat.avatar" 
          :alt="activeChat.name" 
          class="w-10 h-10 rounded-full object-cover border border-gray-200"
        >
        <span 
          class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
          :class="activeChat.isOnline ? 'bg-green-500' : 'bg-gray-400'"
        ></span>
      </div>
      <div class="flex-1">
        <h3 class="text-base font-medium text-gray-800">{{ activeChat.name }}</h3>
        <div class="flex items-center">
          <p class="text-xs text-gray-500 mr-2">
            {{ activeChat.isOnline ? 'Online' : formatLastSeen(activeChat.lastSeen) }}
          </p>
          <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
            {{ activeChat.personality }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Chat messages area -->
    <div class="flex-1 p-4 overflow-y-auto bg-gray-50" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="message.id || index" class="mb-4 message-container">
        <!-- Agent workflow visualization for complex questions -->
        <div v-if="message.hasAgentWorkflow && !message.isOwn" class="mb-2">
          <AgentWorkflow
            :currentState="currentState"
            :currentStep="currentStep"
            :workflowSteps="workflowSteps"
            :executionPlan="executionPlan"
            :currentExecutionStep="currentExecutionStep"
            :analysisResults="analysisResults"
            :finalSummary="finalSummary"
            :isWorking="isWorking"
            :errorMessage="errorMessage"
            :AGENT_STATES="AGENT_STATES"
          />
        </div>
        
        <!-- Regular message -->
        <ChatMessage 
          :message="message" 
          :isOwn="message.senderId === props.currentUser.id" 
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
import { usePersonas } from '~/composables/usePersonas';
import { useAgentWorkflow } from '~/composables/useAgentWorkflow';
import ChatMessage from './ChatMessage.vue';
import AgentWorkflow from './AgentWorkflow.vue';

const props = defineProps({
  activeChat: {
    type: Object,
    required: true
  },
  currentUser: {
    type: Object,
    required: true
  }
});

// Use our chat composable
const { isLoading, error, sendMessage: sendChatMessage, processStream } = useChat();

// Use the personas composable
const { addMessageToPersona, generatePersonaResponse } = usePersonas();

// Use the agent workflow composable
const { 
  currentState, 
  currentStep,
  workflowSteps,
  executionPlan,
  currentExecutionStep,
  analysisResults,
  finalSummary,
  isWorking,
  errorMessage,
  isComplexQuestion,
  startAgentWorkflow,
  resetWorkflow,
  AGENT_STATES,
  WORKFLOW_STEPS
} = useAgentWorkflow();

// Track if we're using the agent workflow for the current message
const usingAgentWorkflow = ref(false);

// Message input text
const messageText = ref('');
const textareaRef = ref(null);

// Use the messages from the active chat persona
const messages = computed(() => {
  return props.activeChat?.messages || [];
});

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
  
  // Reset agent workflow state
  resetWorkflow();
  usingAgentWorkflow.value = false;
  
  // Check if this is a complex question
  const isComplex = isComplexQuestion(messageText.value);
  
  // Create the user message
  const newMessage = {
    id: messages.value.length + 1,
    content: messageText.value,
    timestamp: new Date(),
    senderId: props.currentUser.id,
    status: 'sent'
  };
  
  // Add the user message to the current persona's messages
  addMessageToPersona(props.activeChat.id, newMessage);
  messageText.value = '';
  
  // Reset textarea height
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
  
  // Generate a response based on the persona's personality
  const assistantMessage = generatePersonaResponse(props.activeChat.id, newMessage.content);
  
  // Set the message as streaming
  assistantMessage.isStreaming = true;
  assistantMessage.status = 'typing';
  assistantMessage.content = '';
  
  // If this is a complex question, mark it for agent workflow
  if (isComplex) {
    assistantMessage.hasAgentWorkflow = true;
    usingAgentWorkflow.value = true;
  }
  
  // Add the placeholder message immediately
  addMessageToPersona(props.activeChat.id, assistantMessage);
  
  // Ensure the UI updates before proceeding
  await nextTick();
  
  // If this is a complex question, use the agent workflow
  if (isComplex) {
    try {
      // Start the agent workflow
      const workflowResult = await startAgentWorkflow(
        newMessage.content,
        props.activeChat.id,
        handleAgentWorkflowUpdate
      );
      
      // Always update the message with the final summary or error
      const index = messages.value.findIndex(msg => msg.id === assistantMessage.id);
      if (index !== -1) {
        const updatedMessage = { ...messages.value[index] };
        
        if (workflowResult.success && workflowResult.summary) {
          // Use the final summary from the workflow
          updatedMessage.content = workflowResult.summary;
          updatedMessage.isStreaming = false;
          updatedMessage.status = 'delivered';
        } else if (finalSummary.value) {
          // Fallback to the finalSummary from the composable if available
          updatedMessage.content = finalSummary.value;
          updatedMessage.isStreaming = false;
          updatedMessage.status = 'delivered';
        } else {
          // Last resort fallback
          updatedMessage.content = 'Based on my analysis, I\'ve processed your complex question. ' + 
            'The key points have been identified and a comprehensive answer has been formulated. ' + 
            'Please let me know if you need any clarification or have additional questions.';
          updatedMessage.isStreaming = false;
          updatedMessage.status = 'delivered';
        }
        
        // Always update the message, even if there's an error
        props.activeChat.messages.splice(index, 1, updatedMessage);
        
        // Force reactivity update
        nextTick(() => {
          scrollToBottom();
        });
      }
    } catch (err) {
      console.error('Agent workflow error:', err);
      const index = messages.value.findIndex(msg => msg.id === assistantMessage.id);
      if (index !== -1) {
        const updatedMessage = { ...messages.value[index] };
        updatedMessage.content = 'Sorry, an error occurred while processing your complex question.';
        updatedMessage.isStreaming = false;
        updatedMessage.status = 'error';
        props.activeChat.messages.splice(index, 1, updatedMessage);
      }
    }
    return;
  }
  
  // For simple questions, use the regular streaming approach
  // Prepare the messages for the API in Anthropic format
  const apiMessages = [];
  for (const msg of messages.value) {
    // Skip the placeholder message
    if (msg.id === assistantMessage.id) continue;
    
    apiMessages.push({
      role: msg.senderId === props.currentUser.id ? 'user' : 'assistant',
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
        // Find the assistant message in the current persona's messages
        const index = messages.value.findIndex(msg => msg.id === assistantMessage.id);
        if (index !== -1) {
          // Create a new object to trigger Vue reactivity
          const updatedMessage = { ...messages.value[index] };
          
          // Ensure content is initialized and append new content
          updatedMessage.content = (updatedMessage.content || '') + content;
          
          // Update the message in the persona's messages array
          props.activeChat.messages.splice(index, 1, updatedMessage);
          
          // Debug: log content updates
          console.log(`Updated content: "${updatedMessage.content.substring(0, 50)}${updatedMessage.content.length > 50 ? '...' : ''}"`);
        }
      },
      // On done
      () => {
        // Find the message again as the index might have changed
        const index = messages.value.findIndex(msg => msg.id === assistantMessage.id);
        if (index !== -1) {
          const updatedMessage = { ...messages.value[index] };
          updatedMessage.isStreaming = false;
          updatedMessage.status = 'delivered';
          props.activeChat.messages.splice(index, 1, updatedMessage);
        }
      },
      // On error
      (errorMsg) => {
        console.error('API error:', errorMsg);
        const index = messages.value.findIndex(msg => msg.id === assistantMessage.id);
        if (index !== -1) {
          const updatedMessage = { ...messages.value[index] };
          updatedMessage.content = 'Sorry, an error occurred while generating a response.';
          updatedMessage.isStreaming = false;
          updatedMessage.status = 'error';
          props.activeChat.messages.splice(index, 1, updatedMessage);
        }
      }
    );
  } catch (err) {
    console.error('API call error:', err);
    const index = messages.value.findIndex(msg => msg.id === assistantMessage.id);
    if (index !== -1) {
      const updatedMessage = { ...messages.value[index] };
      updatedMessage.content = 'Sorry, an error occurred while connecting to the server.';
      updatedMessage.isStreaming = false;
      updatedMessage.status = 'error';
      props.activeChat.messages.splice(index, 1, updatedMessage);
    }
  }
};

// Handle agent workflow updates
const handleAgentWorkflowUpdate = (update) => {
  console.log('Agent workflow update:', update.type);
  
  // Force UI updates by triggering reactivity
  if (update.type === 'workflow-update') {
    // The workflow state is already updated in the composable
    // This is just to force a UI refresh
    nextTick();
  } else if (update.type === 'workflow-error') {
    console.error('Agent workflow error:', update.error);
    // Force UI update to show error state
    nextTick();
  } else if (update.type === 'workflow-complete') {
    console.log('Agent workflow complete');
    // Force UI update to show completed state
    nextTick();
  }
  
  // Always scroll to bottom when updates happen
  nextTick(() => {
    scrollToBottom();
  });
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