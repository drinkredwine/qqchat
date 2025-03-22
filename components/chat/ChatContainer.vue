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
    
    <!-- Chat input component -->
    <ChatInput @send-message="sendMessage" />
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
  cleanFinalSummary,
  AGENT_STATES,
  WORKFLOW_STEPS
} = useAgentWorkflow();

// Track if we're using the agent workflow for the current message
const usingAgentWorkflow = ref(false);

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
const sendMessage = async (text) => {
  if (!text || !text.trim()) return;
  
  // Reset agent workflow state
  resetWorkflow();
  usingAgentWorkflow.value = false;
  
  // Check if this is a complex question
  const isComplex = isComplexQuestion(text);
  
  // Create the user message
  const newMessage = {
    id: messages.value.length + 1,
    content: text,
    timestamp: new Date(),
    senderId: props.currentUser.id,
    status: 'sent'
  };
  
  // Add the user message to the current persona's messages
  addMessageToPersona(props.activeChat.id, newMessage);
  
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
          // Use the final summary from the workflow, cleaned of any meta-commentary
          updatedMessage.content = cleanFinalSummary(workflowResult.summary);
          updatedMessage.isStreaming = false;
          updatedMessage.status = 'delivered';
        } else if (finalSummary.value) {
          // Fallback to the finalSummary from the composable if available
          // (which should already be cleaned in the workflow)
          updatedMessage.content = finalSummary.value;
          updatedMessage.isStreaming = false;
          updatedMessage.status = 'delivered';
        } else {
          // Last resort fallback
          updatedMessage.content = 'I\'ve analyzed your question and found the most relevant information. ' + 
            'Here\'s what you need to know: ' + question.substring(0, 50) + 
            (question.length > 50 ? '...' : '') + 
            '\n\nPlease let me know if you need any clarification or have additional questions.';
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