<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <main class="flex-grow flex flex-col justify-center items-center p-6">
      <div class="w-full mb-8 text-center">
        <h1 class="text-5xl font-bold text-blue-500 mb-4">Facebook-Style Chat</h1>
        <p class="text-xl text-gray-700 mb-8">A modern chat interface built with Nuxt.js and Tailwind CSS</p>
        
        <!-- Chat Container Component -->
        <chat-container />
      </div>
      
      <!-- Original demo components (hidden for now) -->
      <div class="hidden">
        <TailwindCard />
        <TailwindFeatures />
      </div>
    </main>
    
    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<!-- No custom CSS needed, all styling is done with Tailwind classes -->