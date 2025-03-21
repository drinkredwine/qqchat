<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
    <div class="w-full mb-8 text-center">
      <h1 class="text-5xl font-bold text-blue-500 mb-4">Facebook-Style Chat</h1>
      <p class="text-xl text-gray-700 mb-8">A modern chat interface built with Nuxt.js and Tailwind CSS</p>
      
      <!-- Chat Container Component -->
      <ChatContainer />
    </div>
    
    <!-- Original demo components (hidden for now) -->
    <div class="hidden">
      <TailwindCard />
      <TailwindFeatures />
    </div>
  </div>
</template>

<!-- No custom CSS needed, all styling is done with Tailwind classes -->