<template>
  <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden my-8">
    <h2 class="text-2xl font-bold text-center py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      Tailwind Features
    </h2>
    
    <!-- Responsive Design -->
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Responsive Design</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <div class="bg-blue-100 p-3 rounded text-center">Mobile</div>
        <div class="bg-blue-200 p-3 rounded text-center">Tablet</div>
        <div class="bg-blue-300 p-3 rounded text-center">Desktop</div>
      </div>
    </div>
    
    <!-- Hover, Focus, and Other States -->
    <div class="p-6 border-t border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Interactive States</h3>
      <button class="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded mb-2 w-full">
        Hover Me
      </button>
      <input 
        type="text" 
        placeholder="Focus Me" 
        class="mt-2 w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    
    <!-- Dark Mode (if enabled in tailwind.config.js) -->
    <div class="p-6 border-t border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Utility Classes</h3>
      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Flexbox Layout</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>Spacing System</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Typography</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Colors</span>
        </div>
      </div>
    </div>
    
    <!-- Animation -->
    <div class="p-6 border-t border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Animations</h3>
      <div class="flex justify-center">
        <div class="animate-bounce bg-indigo-500 p-2 w-10 h-10 ring-1 ring-slate-900/5 shadow-lg rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>