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
        <!-- Use Monaco Editor for messages with code blocks or markdown (client-only) -->
        <ClientOnly>
          <MonacoMarkdownViewer 
            v-if="hasMarkdownOrCode"
            :content="message.content"
            :theme="editorTheme"
            :isOwn="isOwn"
          />
          <template #fallback>
            <div v-html="formattedContent" class="fallback-content"></div>
          </template>
        </ClientOnly>
        <!-- Use simple formatting for regular messages -->
        <div v-if="!hasMarkdownOrCode" v-html="formattedContent"></div>
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
import MonacoMarkdownViewer from './MonacoMarkdownViewer.vue';

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

// Determine if the message contains markdown or code blocks
const hasMarkdownOrCode = computed(() => {
  const content = props.message.content || '';
  
  // Check for common markdown patterns
  const hasMarkdown = /(\#{1,6}\s|\*\*|\*|\_|\~\~|\`\`\`|\`|\>\s|\-\s|\+\s|\d+\.\s|\[.*\]\(.*\)|\!\[.*\]\(.*\)|\|[\s\S]*\|)/.test(content);
  
  // Check for code blocks
  const hasCodeBlock = /```[\s\S]*?```/.test(content);
  
  // Check for inline code
  const hasInlineCode = /`[^`]+`/.test(content);
  
  return hasMarkdown || hasCodeBlock || hasInlineCode;
});

// Format the content with proper line breaks only (for non-markdown messages)
const formattedContent = computed(() => {
  let content = props.message.content || '';
  
  // Replace line breaks with <br> tags
  content = content.replace(/\n/g, '<br>');
  
  return content;
});

// Set the editor theme based on message ownership
const editorTheme = computed(() => {
  return props.isOwn ? 'vs-dark' : 'vs';
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

/* No cursor animation needed */

/* Ensure smooth text rendering */
.message-content div {
  word-break: break-word;
}

/* Fallback content styling */
.fallback-content {
  padding: 0.5rem 0;
  white-space: pre-wrap;
}

/* Monaco editor container styling */
.monaco-markdown-viewer {
  margin: 0.25rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Monaco editor styling for own messages */
.own-message .monaco-editor .view-lines {
  color: white !important;
}

/* Monaco editor styling for other messages */
.other-message .monaco-editor .view-lines {
  color: #374151 !important;
}

/* Code block styling */
pre code {
  border-radius: 0.375rem;
  font-family: 'Fira Code', monospace !important;
  font-size: 0.9em;
}

/* Ensure proper padding within the editor */
.monaco-editor .view-lines {
  padding: 0.5rem 0;
}
</style>