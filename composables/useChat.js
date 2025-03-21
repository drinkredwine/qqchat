import { ref } from 'vue';

export function useChat() {
  const isLoading = ref(false);
  const error = ref(null);
  
  /**
   * Send a message to the chat API
   * @param {Array} messages - Array of messages in Anthropic format
   * @param {Boolean} stream - Whether to stream the response
   * @returns {Promise} - Promise that resolves with the response
   */
  const sendMessage = async (messages, stream = true) => {
    isLoading.value = true;
    error.value = null;
    
    console.log('Sending message to API:', {
      messageCount: messages.length,
      stream
    });
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          stream
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      // If streaming is not requested, return the JSON response
      if (!stream) {
        const data = await response.json();
        isLoading.value = false;
        return data;
      }
      
      // Return the response for streaming
      isLoading.value = false;
      return response;
      
    } catch (err) {
      error.value = err.message || 'An error occurred';
      isLoading.value = false;
      throw err;
    }
  };
  
  /**
   * Process a streaming response
   * @param {Response} response - Fetch API response object
   * @param {Function} onContent - Callback for content chunks
   * @param {Function} onDone - Callback when stream is done
   * @param {Function} onError - Callback for errors
   */
  const processStream = async (response, onContent, onDone, onError) => {
    console.log('Processing stream response');
    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let eventCount = 0;
      let contentBuffer = ''; // Buffer for content
      let bufferTimer = null;
      const BUFFER_DELAY = 30; // Small delay for smoother updates
      
      // Function to process buffered content with a slight delay for smoother updates
      const processContentBuffer = () => {
        if (contentBuffer.length > 0) {
          // Clear any existing timer
          if (bufferTimer) clearTimeout(bufferTimer);
          
          // Set a short timeout to batch updates
          bufferTimer = setTimeout(() => {
            onContent(contentBuffer);
            contentBuffer = '';
            bufferTimer = null;
          }, BUFFER_DELAY);
        }
      };
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the chunk and add it to our buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process any complete messages in the buffer
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              eventCount++;
              console.log(`Received event #${eventCount}, type: ${data.type}`);
              
              if (data.type === 'content' && data.content) {
                const contentPreview = data.content.substring(0, 30);
                console.log(`Content chunk: "${contentPreview}${data.content.length > 30 ? '...' : ''}" (length: ${data.content.length})`);
                // Make sure we're not working with undefined content
                if (data.content) {
                  // Add to buffer and process immediately
                  contentBuffer += data.content;
                  processContentBuffer();
                } else {
                  console.warn('Received empty content chunk');
                }
              } else if (data.type === 'done') {
                console.log('Received done event');
                // Process any remaining buffered content
                processContentBuffer();
                onDone();
                return;
              } else if (data.type === 'error') {
                console.log('Received error:', data.error);
                onError(data.error);
                return;
              }
            } catch (e) {
              console.error('Error parsing SSE message:', e);
              onError('Error parsing server response');
            }
          }
        }
        
        // Process any accumulated content immediately
        if (contentBuffer.length > 0) {
          processContentBuffer();
        }
      }
      
      // Process any remaining content
      if (contentBuffer.length > 0) {
        processContentBuffer();
      }
      
      // Stream ended without a 'done' event
      onDone();
      
    } catch (err) {
      console.error('Stream processing error:', err);
      onError(err.message || 'Error processing stream');
    }
  };
  
  return {
    isLoading,
    error,
    sendMessage,
    processStream
  };
}