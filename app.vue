<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
    <div class="max-w-md p-8 bg-white rounded-lg shadow-lg text-center mb-8">
      <h1 class="text-5xl font-bold text-emerald-500 mb-6">Hello World!</h1>
      <p class="text-xl text-gray-700">Welcome to my Nuxt.js application with Tailwind CSS</p>
      
      <!-- Tailwind showcase -->
      <div class="mt-8 grid grid-cols-3 gap-4">
        <div class="p-4 bg-blue-500 text-white rounded-md">Tailwind</div>
        <div class="p-4 bg-green-500 text-white rounded-md">is</div>
        <div class="p-4 bg-purple-500 text-white rounded-md">awesome!</div>
      </div>
      
      <button class="mt-6 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors">
        Click me
      </button>
    </div>
    
    <!-- Include our Tailwind demo components -->
    <TailwindCard />
    <TailwindFeatures />
  </div>
</template>

<!-- No custom CSS needed, all styling is done with Tailwind classes -->