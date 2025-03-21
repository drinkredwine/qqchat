import Anthropic from '@anthropic-ai/sdk';
import { defineEventHandler, readBody, getRequestIP } from 'h3';
import { isRateLimited, getRemainingRequests } from '../utils/rateLimit';

export default defineEventHandler(async (event) => {
  console.log('Chat API called');
  
  // Get client IP for rate limiting
  const clientIp = getRequestIP(event) || 'unknown';
  
  // Check rate limiting
  if (isRateLimited(clientIp)) {
    console.log('Rate limit exceeded for IP:', clientIp);
    return {
      error: 'Rate limit exceeded. Please try again later.',
      status: 429,
      ...getRemainingRequests(clientIp)
    };
  }
  
  // Log the request URL query parameters
  console.log('Request URL:', event.node.req.url);
  try {
    const body = await readBody(event);
    const { messages, stream = false } = body;
    
    console.log('Request body:', JSON.stringify({
      messageCount: messages?.length,
      stream
    }));

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        error: 'Invalid messages format. Expected an array of messages.',
        status: 400
      };
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // If streaming is requested, handle differently
    if (stream) {
      console.log('Streaming requested, handling with streamResponse');
      // We'll implement streaming in a separate function
      return streamResponse(event, anthropic, messages);
    }
    
    console.log('Non-streaming request');

    // For non-streaming responses
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 4096,
      messages: messages,
      temperature: 0.7,
    });

    return {
      response: response.content,
      usage: response.usage,
      status: 200
    };
  } catch (error) {
    console.error('Error in chat API:', error);
    return {
      error: error.message || 'An error occurred while processing your request',
      status: error.status || 500
    };
  }
});

// This function will be implemented for streaming responses
const streamResponse = async (event, anthropic, messages) => {
  try {
    console.log('Starting streaming response');
    
    // Set up the response headers for streaming
    event.node.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const stream = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 4096,
      messages: messages,
      temperature: 0.7,
      stream: true,
    });

    console.log('Stream created, waiting for chunks');
    let chunkCount = 0;
    
    for await (const chunk of stream) {
      chunkCount++;
      
      if (chunk.type === 'content_block_delta' && chunk.delta.text) {
        // Send the chunk as an SSE event
        const eventData = JSON.stringify({
          content: chunk.delta.text,
          type: 'content'
        });
        console.log(`Sending content chunk #${chunkCount}: "${chunk.delta.text.substring(0, 30)}${chunk.delta.text.length > 30 ? '...' : ''}"`);
        event.node.res.write(`data: ${eventData}\n\n`);
      } else if (chunk.type === 'message_stop') {
        // Send the final chunk
        console.log('Sending done event');
        event.node.res.write(`data: ${JSON.stringify({
          type: 'done'
        })}\n\n`);
      } else {
        console.log('Received chunk with type:', chunk.type);
      }
    }

    // End the response
    console.log('Stream completed, ending response');
    event.node.res.end();
    return;
  } catch (error) {
    console.error('Error in streaming chat API:', error);
    event.node.res.write(`data: ${JSON.stringify({
      error: error.message || 'An error occurred during streaming',
      type: 'error'
    })}\n\n`);
    event.node.res.end();
    return;
  }
};