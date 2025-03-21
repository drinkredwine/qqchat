import Anthropic from '@anthropic-ai/sdk';
import { defineEventHandler, readBody, getRequestIP } from 'h3';
import { isRateLimited, getRemainingRequests } from '../utils/rateLimit';

export default defineEventHandler(async (event) => {
  // Get client IP for rate limiting
  const clientIp = getRequestIP(event) || 'unknown';
  
  // Check rate limiting
  if (isRateLimited(clientIp)) {
    return {
      error: 'Rate limit exceeded. Please try again later.',
      status: 429,
      ...getRemainingRequests(clientIp)
    };
  }
  try {
    const body = await readBody(event);
    const { messages, stream = false } = body;

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
      // We'll implement streaming in a separate function
      return streamResponse(event, anthropic, messages);
    }

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

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.text) {
        // Send the chunk as an SSE event
        event.node.res.write(`data: ${JSON.stringify({
          content: chunk.delta.text,
          type: 'content'
        })}\n\n`);
      } else if (chunk.type === 'message_stop') {
        // Send the final chunk
        event.node.res.write(`data: ${JSON.stringify({
          type: 'done'
        })}\n\n`);
      }
    }

    // End the response
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