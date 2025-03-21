<template>
  <div class="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto p-4">
    <!-- Online users sidebar (only visible on desktop) -->
    <div class="hidden md:block md:w-1/3">
      <div v-for="user in onlineUsers" 
           :key="user.id"
           class="bg-white rounded-xl shadow-lg p-4 w-full max-w-2xl mb-2 flex items-center py-3 px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
           @click="selectUser(user)">
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
    
    <!-- Chat container (or welcome screen if no chat is selected) -->
    <div class="flex-1">
      <ChatContainer v-if="showChat" />
      <div v-else class="h-[600px] w-full flex flex-col items-center justify-center bg-white rounded-xl shadow-xl p-8 text-center">
        <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome to Facebook Chat</h2>
        <p class="text-gray-600 mb-6">Select a conversation to start chatting</p>
        
        <!-- Mobile-only user selection -->
        <div class="block md:hidden w-full">
          <select 
            v-model="selectedUserId" 
            @change="handleMobileUserSelect" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select a friend</option>
            <option v-for="user in onlineUsers" :key="user.id" :value="user.id">
              {{ user.name }} {{ user.isOnline ? '(Online)' : '' }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// State for selected user and chat visibility
const showChat = ref(false);
const selectedUserId = ref('');

// Mock data for online users
const onlineUsers = ref([
  {
    id: 2,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isOnline: true,
    lastSeen: null,
    unreadCount: 3
  },
  {
    id: 3,
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isOnline: true,
    lastSeen: null,
    unreadCount: 0
  },
  {
    id: 4,
    name: 'Robert Johnson',
    avatar: 'https://i.pravatar.cc/150?img=8',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000),
    unreadCount: 0
  },
  {
    id: 5,
    name: 'Emily Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    isOnline: false,
    lastSeen: new Date(Date.now() - 86400000),
    unreadCount: 5
  },
  {
    id: 6,
    name: 'Michael Wilson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isOnline: true,
    lastSeen: null,
    unreadCount: 0
  }
]);

// Function to select a user from the list
const selectUser = (user) => {
  selectedUserId.value = user.id;
  showChat.value = true;
};

// Function to handle mobile user selection from dropdown
const handleMobileUserSelect = () => {
  if (selectedUserId.value) {
    showChat.value = true;
  }
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