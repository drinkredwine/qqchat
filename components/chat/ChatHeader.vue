<template>
  <div class="flex items-center p-4 border-b border-gray-200 bg-white">
    <div class="relative mr-3">
      <img 
        :src="user.avatar" 
        :alt="user.name" 
        class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
      >
      <span 
        class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
        :class="isOnline ? 'bg-green-500' : 'bg-gray-400'"
      ></span>
    </div>
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-gray-800">{{ user.name }}</h3>
      <p class="text-sm text-gray-500">
        {{ isOnline ? 'Online' : formatLastSeen(user.lastSeen) }}
      </p>
    </div>
    <div class="flex space-x-3">
      <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </button>
      <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
      <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  },
  isOnline: {
    type: Boolean,
    default: false
  }
});

// Function to format the last seen time
const formatLastSeen = (date) => {
  if (!date) return 'Offline';
  
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};
</script>