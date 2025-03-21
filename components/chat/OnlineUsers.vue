<template>
  <div class="bg-white rounded-xl shadow-lg p-4 w-full max-w-2xl">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Online Friends</h2>
    <div class="divide-y divide-gray-100">
      <div 
        v-for="user in users" 
        :key="user.id"
        class="flex items-center py-3 px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
        @click="selectUser(user)"
      >
        <div class="relative mr-3">
          <img 
            :src="user.avatar" 
            :alt="user.name" 
            class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          >
          <span 
            class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
            :class="user.isOnline ? 'bg-green-500' : 'bg-gray-400'"
          ></span>
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-gray-800">{{ user.name }}</h3>
          <p class="text-sm text-gray-500">
            {{ user.isOnline ? 'Online' : formatLastSeen(user.lastSeen) }}
          </p>
        </div>
        <div v-if="user.unreadCount > 0" class="flex items-center justify-center bg-blue-500 text-white rounded-full h-6 w-6 text-xs font-bold">
          {{ user.unreadCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  users: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['select-user']);

// Function to select a user to chat with
const selectUser = (user) => {
  emit('select-user', user);
};

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