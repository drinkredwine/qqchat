import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as monaco from 'monaco-editor';

export const useMonacoEditor = () => {
  const isMonacoLoaded = ref(false);
  
  // Initialize Monaco Editor
  const initMonaco = () => {
    if (process.client) {
      // Define custom themes
      monaco.editor.defineTheme('chat-light', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
          { token: 'string', foreground: 'A31515' },
          { token: 'comment', foreground: '008000' }
        ],
        colors: {
          'editor.foreground': '#000000',
          'editor.background': '#F3F4F6',
          'editorCursor.foreground': '#007ACC',
          'editor.lineHighlightBackground': '#F7F7F7',
          'editorLineNumber.foreground': '#999999',
          'editor.selectionBackground': '#ADD6FF',
          'editor.inactiveSelectionBackground': '#E5EBF1'
        }
      });

      monaco.editor.defineTheme('chat-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'comment', foreground: '6A9955' }
        ],
        colors: {
          'editor.foreground': '#FFFFFF',
          'editor.background': '#2563EB', // Match the blue-600 color
          'editorCursor.foreground': '#FFFFFF',
          'editor.lineHighlightBackground': '#2563EB',
          'editorLineNumber.foreground': '#CCCCCC',
          'editor.selectionBackground': '#3B82F6',
          'editor.inactiveSelectionBackground': '#3B82F6'
        }
      });

      isMonacoLoaded.value = true;
    }
  };

  // Create editor instance
  const createEditor = (element, options = {}) => {
    if (!isMonacoLoaded.value) {
      initMonaco();
    }

    const defaultOptions = {
      readOnly: true,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: 'off',
      folding: false,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0,
      renderLineHighlight: 'none',
      overviewRulerBorder: false,
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden'
      },
      wordWrap: 'on',
      wrappingStrategy: 'advanced',
      contextmenu: false,
      links: true,
      padding: {
        top: 8,
        bottom: 8
      }
    };

    const mergedOptions = { ...defaultOptions, ...options };
    return monaco.editor.create(element, mergedOptions);
  };

  // Dispose editor instance
  const disposeEditor = (editor) => {
    if (editor) {
      editor.dispose();
    }
  };

  onMounted(() => {
    initMonaco();
  });

  return {
    isMonacoLoaded,
    initMonaco,
    createEditor,
    disposeEditor,
    monaco: process.client ? monaco : null
  };
};