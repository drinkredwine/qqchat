<template>
  <div class="monaco-markdown-viewer" ref="editorContainer"></div>
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
    gfm: true
  });
  
  try {
    return marked(content);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return content;
  }
};

// Initialize Monaco editor
const initEditor = async () => {
  if (!editorContainer.value || !monaco) return;
  
  // Process the markdown content
  const processedContent = await processMarkdown(props.content);
  
  // Get the appropriate theme
  const editorTheme = props.isOwn ? 'chat-dark' : 'chat-light';
  
  // Configure Monaco editor
  editor = createEditor(editorContainer.value, {
    value: processedContent,
    language: 'html',
    theme: editorTheme,
  });
  
  // Adjust editor height to content
  const contentHeight = Math.min(
    editor.getContentHeight(),
    500 // Maximum height
  );
  
  editorContainer.value.style.height = `${contentHeight}px`;
  editor.layout({ width: editorContainer.value.offsetWidth, height: contentHeight });
  
  // Add custom CSS class based on message ownership
  if (props.isOwn) {
    editorContainer.value.classList.add('own-message');
  } else {
    editorContainer.value.classList.add('other-message');
  }
};

// Update editor content when props change
watch(() => props.content, async (newContent) => {
  if (editor) {
    const processedContent = await processMarkdown(newContent);
    editor.setValue(processedContent);
    
    // Adjust height after content change
    const contentHeight = Math.min(
      editor.getContentHeight(),
      500 // Maximum height
    );
    
    editorContainer.value.style.height = `${contentHeight}px`;
    editor.layout({ width: editorContainer.value.offsetWidth, height: contentHeight });
  }
}, { immediate: false });

// Watch for theme changes
watch(() => props.theme, (newTheme) => {
  if (editor && monaco) {
    const editorTheme = props.isOwn ? 'chat-dark' : 'chat-light';
    monaco.editor.setTheme(editorTheme);
  }
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
  if (editor) {
    disposeEditor(editor);
  }
  if (process.client) {
    window.removeEventListener('resize', handleResize);
  }
});

// Handle window resize
const handleResize = () => {
  if (editor && editorContainer.value) {
    editor.layout({
      width: editorContainer.value.offsetWidth,
      height: editorContainer.value.offsetHeight
    });
  }
};
</script>

<style>
.monaco-markdown-viewer {
  width: 100%;
  min-height: 20px;
  border-radius: 0.5rem;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Styling for own messages */
.own-message .monaco-editor {
  background-color: transparent !important;
}

.own-message .monaco-editor .view-lines {
  color: white !important;
}

/* Styling for other messages */
.other-message .monaco-editor {
  background-color: transparent !important;
}

.other-message .monaco-editor .view-lines {
  color: #374151 !important;
}

/* Style for code blocks */
.monaco-markdown-viewer pre {
  border-radius: 0.375rem;
  margin: 0.5rem 0;
}

.monaco-markdown-viewer code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

/* Style for headings */
.monaco-markdown-viewer h1,
.monaco-markdown-viewer h2,
.monaco-markdown-viewer h3,
.monaco-markdown-viewer h4,
.monaco-markdown-viewer h5,
.monaco-markdown-viewer h6 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

/* Style for links */
.monaco-markdown-viewer a {
  color: #3b82f6;
  text-decoration: underline;
}

/* Style for lists */
.monaco-markdown-viewer ul,
.monaco-markdown-viewer ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

/* Style for blockquotes */
.monaco-markdown-viewer blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  margin: 0.5rem 0;
  color: #6b7280;
}

/* Style for tables */
.monaco-markdown-viewer table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5rem 0;
}

.monaco-markdown-viewer th,
.monaco-markdown-viewer td {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
}

.monaco-markdown-viewer th {
  background-color: #f3f4f6;
}
</style>