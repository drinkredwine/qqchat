<template>
  <div class="markdown-content" :class="{ 'own-message-content': isOwn }">
    <div v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { marked } from 'marked';
import * as shiki from 'shiki';

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  isOwn: {
    type: Boolean,
    default: false
  }
});

const renderedContent = ref('');
let highlighter = null;

// Initialize the Shiki highlighter
const initHighlighter = async () => {
  try {
    highlighter = await shiki.getHighlighter({
      theme: props.isOwn ? 'github-dark' : 'github-light',
      langs: ['javascript', 'typescript', 'html', 'css', 'json', 'markdown', 'python', 'bash', 'vue', 'shell', 'jsx', 'tsx']
    });
  } catch (error) {
    console.error('Failed to initialize Shiki highlighter:', error);
  }
};

// Process markdown with code highlighting
const processMarkdown = async (content) => {
  if (!content) return '';
  
  if (!highlighter) {
    await initHighlighter();
  }
  
  // Configure marked to use Shiki for syntax highlighting
  marked.setOptions({
    highlight: (code, lang) => {
      if (highlighter) {
        try {
          return highlighter.codeToHtml(code, { lang: lang || 'text' });
        } catch (error) {
          console.error('Error highlighting code:', error);
          return code;
        }
      }
      return code;
    },
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
  });
  
  try {
    return marked(content);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return content;
  }
};

// Update rendered content when props change
watch(() => props.content, async (newContent) => {
  renderedContent.value = await processMarkdown(newContent);
}, { immediate: false });

// Initialize on mount
onMounted(async () => {
  if (process.client) {
    await initHighlighter();
    renderedContent.value = await processMarkdown(props.content);
  }
});
</script>

<style>
/* Base styling for markdown content */
.markdown-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  word-break: break-word;
}

/* Style for headings */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 1.3;
}

.markdown-content h1 {
  font-size: 1.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.3rem;
}

.markdown-content h2 {
  font-size: 1.3em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.2rem;
}

.markdown-content h3 {
  font-size: 1.2em;
}

.markdown-content h4 {
  font-size: 1.1em;
}

/* Style for code blocks */
.markdown-content pre {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.375rem;
  margin: 0.5rem 0;
  padding: 0.75rem;
  overflow-x: auto;
}

.markdown-content pre code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  white-space: pre;
}

/* Style for inline code */
.markdown-content p code,
.markdown-content li code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

/* Style for links */
.markdown-content a {
  color: #3b82f6;
  text-decoration: underline;
}

/* Style for lists */
.markdown-content ul,
.markdown-content ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.markdown-content li {
  margin: 0.25rem 0;
}

/* Style for blockquotes */
.markdown-content blockquote {
  border-left: 4px solid rgba(0, 0, 0, 0.1);
  padding-left: 1rem;
  margin: 0.5rem 0;
  color: rgba(0, 0, 0, 0.6);
}

/* Style for horizontal rules */
.markdown-content hr {
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}

/* Style for tables */
.markdown-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5rem 0;
}

.markdown-content th,
.markdown-content td {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
}

.markdown-content th {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Ensure proper spacing for paragraphs */
.markdown-content p {
  margin: 0.5rem 0;
}

/* Special styling for own messages */
.own-message-content {
  color: white;
}

.own-message-content h1,
.own-message-content h2 {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.own-message-content pre {
  background-color: rgba(255, 255, 255, 0.1);
}

.own-message-content p code,
.own-message-content li code {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

.own-message-content a {
  color: #93c5fd;
}

.own-message-content blockquote {
  border-left: 4px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.own-message-content hr {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.own-message-content th,
.own-message-content td {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.own-message-content th {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Shiki syntax highlighting adjustments */
.own-message-content .shiki {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.markdown-content .shiki {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
</style>