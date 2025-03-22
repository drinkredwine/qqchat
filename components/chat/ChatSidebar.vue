<template>
  <div class="w-80 h-full bg-white border-r border-gray-200 overflow-hidden flex flex-col">
    <!-- User profile section -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center">
        <img :src="currentUser.avatar" :alt="currentUser.name" class="w-10 h-10 rounded-full object-cover border border-gray-300">
        <div class="ml-3 flex-1">
          <h3 class="text-lg font-medium text-gray-800">{{ currentUser.name }}</h3>
          <p class="text-sm text-gray-500">Online</p>
        </div>
        <button class="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search bar -->
    <div class="p-3 border-b border-gray-200">
      <div class="relative">
        <input 
          type="text" 
          placeholder="Search conversations" 
          class="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        >
        <div class="absolute left-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Contacts list -->
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="contact in contacts" 
        :key="contact.id"
        @click="selectContact(contact)"
        :class="[
          'flex items-center p-3 cursor-pointer transition-colors hover:bg-gray-50',
          activeContact.id === contact.id ? 'bg-blue-50' : ''
        ]"
      >
        <div class="relative">
          <img 
            :src="contact.avatar" 
            :alt="contact.name" 
            class="w-12 h-12 rounded-full object-cover border border-gray-200"
          >
          <span 
            class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
            :class="contact.isOnline ? 'bg-green-500' : 'bg-gray-400'"
          ></span>
        </div>
        <div class="ml-3 flex-1 min-w-0">
          <div class="flex justify-between items-baseline">
            <h3 class="text-sm font-medium text-gray-900 truncate">{{ contact.name }}</h3>
            <span class="text-xs text-gray-500">{{ formatTime(contact.lastMessage?.timestamp) }}</span>
          </div>
          <p class="text-xs text-gray-500 truncate">
            {{ contact.lastMessage?.content || 'No messages yet' }}
          </p>
          <p class="text-xs text-blue-600 truncate mt-1">
            <span class="font-medium">Specialty:</span> {{ contact.specialty }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { usePersonas } from '~/composables/usePersonas';

const emit = defineEmits(['select-contact']);

// Get personas and current user from the composable
const { personas, currentUser } = usePersonas();

// Use personas as contacts
const contacts = personas;

// Currently active contact
const activeContact = ref(contacts[0]);

// Select a contact
const selectContact = (contact) => {
  activeContact.value = contact;
  emit('select-contact', contact);
};

// Format timestamp
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[messageDate.getDay()];
  } else {
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};
</script>

<style scoped>
/* Custom scrollbar for contacts list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>