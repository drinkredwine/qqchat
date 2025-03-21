// This plugin ensures Monaco Editor is only loaded on the client side
import * as monaco from 'monaco-editor';

export default defineNuxtPlugin(() => {
  // Initialize Monaco Editor
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
});