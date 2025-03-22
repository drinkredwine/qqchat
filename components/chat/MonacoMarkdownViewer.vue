<template>
  <div class="markdown-viewer" ref="editorContainer"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { marked } from 'marked';
import * as shiki from 'shiki';
import { useMonacoEditor } from '~/composables/useMonacoEditor';

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    default: 'vs'  // 'vs', 'vs-dark', or 'hc-black'
  },
  height: {
    type: String,
    default: 'auto'
  },
  isOwn: {
    type: Boolean,
    default: false
  }
});

const editorContainer = ref(null);
let editor = null;
let highlighter = null;

// Use our Monaco Editor composable
const { createEditor, disposeEditor, monaco } = useMonacoEditor();

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
    // Treat all messages as markdown
    headerIds: true,
    mangle: false
  });
  
  try {
    // Ensure content is treated as markdown even if it doesn't have explicit markdown syntax
    // This will allow regular text to be rendered with proper formatting
    return marked(content);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return content;
  }
};

// Initialize Monaco editor or render HTML directly
const initEditor = async () => {
  if (!editorContainer.value) return;
  
  // Process the markdown content
  const processedContent = await processMarkdown(props.content);
  
  // Add custom CSS class based on message ownership
  if (props.isOwn) {
    editorContainer.value.classList.add('own-message');
  } else {
    editorContainer.value.classList.add('other-message');
  }
  
  // Instead of using Monaco Editor to display HTML code, render the HTML directly
  editorContainer.value.innerHTML = processedContent;
  
  // Set appropriate height based on content
  const contentHeight = Math.min(
    editorContainer.value.scrollHeight,
    500 // Maximum height
  );
  
  editorContainer.value.style.height = `${contentHeight}px`;
};

// Update content when props change
watch(() => props.content, async (newContent) => {
  if (editorContainer.value) {
    const processedContent = await processMarkdown(newContent);
    editorContainer.value.innerHTML = processedContent;
    
    // Adjust height after content change
    const contentHeight = Math.min(
      editorContainer.value.scrollHeight,
      500 // Maximum height
    );
    
    editorContainer.value.style.height = `${contentHeight}px`;
  }
}, { immediate: false });

// Watch for theme changes - not needed with direct HTML rendering
watch(() => props.theme, (newTheme) => {
  // Theme is now handled via CSS classes
}, { immediate: false });

// Initialize on mount
onMounted(async () => {
  if (process.client) {
    await initHighlighter();
    await initEditor();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
  }
});

// Clean up on unmount
onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize);
  }
});

// Handle window resize
const handleResize = () => {
  if (editorContainer.value) {
    // Recalculate height based on content
    const contentHeight = Math.min(
      editorContainer.value.scrollHeight,
      500 // Maximum height
    );
    
    editorContainer.value.style.height = `${contentHeight}px`;
  }
};
</script>

<style>
.markdown-viewer {
  width: 100%;
  min-height: 20px;
  border-radius: 0.5rem;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  padding: 0.5rem 0;
}

/* Styling for own messages */
.own-message {
  color: white !important;
}

/* Styling for other messages */
.other-message {
  color: #374151 !important;
}

/* Style for code blocks */
.markdown-viewer pre {
  border-radius: 0.375rem;
  margin: 0.5rem 0;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.own-message pre {
  background-color: rgba(255, 255, 255, 0.1);
}

.markdown-viewer code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

/* Style for inline code */
.markdown-viewer p code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

.own-message p code {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Style for headings */
.markdown-viewer h1,
.markdown-viewer h2,
.markdown-viewer h3,
.markdown-viewer h4,
.markdown-viewer h5,
.markdown-viewer h6 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 1.3;
}

.markdown-viewer h1 {
  font-size: 1.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.3rem;
}

.markdown-viewer h2 {
  font-size: 1.3em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.2rem;
}

.markdown-viewer h3 {
  font-size: 1.2em;
}

.markdown-viewer h4 {
  font-size: 1.1em;
}

.own-message h1,
.own-message h2 {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Style for links */
.markdown-viewer a {
  color: #3b82f6;
  text-decoration: underline;
}

.own-message a {
  color: #93c5fd;
}

/* Style for lists */
.markdown-viewer ul,
.markdown-viewer ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.markdown-viewer li {
  margin: 0.25rem 0;
}

/* Style for blockquotes */
.markdown-viewer blockquote {
  border-left: 4px solid rgba(0, 0, 0, 0.1);
  padding-left: 1rem;
  margin: 0.5rem 0;
  color: rgba(0, 0, 0, 0.6);
}

.own-message blockquote {
  border-left: 4px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

/* Style for horizontal rules */
.markdown-viewer hr {
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}

.own-message hr {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* Style for tables */
.markdown-viewer table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5rem 0;
}

.markdown-viewer th,
.markdown-viewer td {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
}

.markdown-viewer th {
  background-color: rgba(0, 0, 0, 0.05);
}

.own-message th,
.own-message td {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.own-message th {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Ensure proper spacing for paragraphs */
.markdown-viewer p {
  margin: 0.5rem 0;
}
</style>