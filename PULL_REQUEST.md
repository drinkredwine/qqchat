# Fix Streaming Chat Response Not Showing Immediately

## Description
This PR fixes the issue where streaming chat responses were not showing immediately after the user sends a message.

## Changes
- Modified the `sendMessage` function in `ChatContainer.vue` to display an empty assistant message with a typing indicator immediately after the user sends their message
- Added `nextTick()` to ensure the UI updates before making the API call
- The empty message is then filled with the streaming response as it comes in

## Related Issues
Fixes #5

## Testing
1. Send a message in the chat interface
2. Verify that an empty message with a typing indicator appears immediately
3. Verify that the empty message is gradually filled with the streaming response

## Implementation Details
The key change is in the `sendMessage` function in `ChatContainer.vue`:

1. We create and add the user's message to the messages array
2. We immediately create and add an empty assistant message with a typing indicator
3. We use `await nextTick()` to ensure the UI updates before making the API call
4. The API call is then made, and the streaming response is used to fill the empty message

This approach ensures that users get immediate feedback when they send a message, rather than having to wait for the API call to begin before seeing any response.