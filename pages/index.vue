<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
    <div class="w-full max-w-4xl mx-auto mb-8 text-center">
      <h1 class="text-5xl font-bold text-blue-500 mb-4">Claude 3.7 Chat</h1>
      <p class="text-xl text-gray-700 mb-8">A modern chat interface powered by Claude 3.7 AI</p>
      
      <!-- Chat Container Component -->
      <div class="flex justify-center">
        <chat-container />
      </div>
    </div>
    
    <!-- Original demo components (hidden for now) -->
    <div class="hidden">
      <TailwindCard />
      <TailwindFeatures />
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Facebook-Style Chat - Home',
    meta: [
      { 
        hid: 'description', 
        name: 'description', 
        content: 'A modern chat interface built with Nuxt.js and Tailwind CSS. Experience seamless communication with our Facebook-style chat application.' 
      }
    ]
  }
}
</script>