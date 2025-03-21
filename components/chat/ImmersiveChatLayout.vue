<template>
  <div class="flex h-screen w-full bg-gray-100 overflow-hidden">
    <!-- Sidebar with contacts -->
    <ChatSidebar @select-contact="handleContactSelect" />
    
    <!-- Main chat area -->
    <div class="flex-1 flex flex-col">
      <!-- Chat container -->
      <ChatContainer 
        :active-chat="activeContact"
        :current-user="currentUser"
        class="flex-1"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatSidebar from './ChatSidebar.vue';
import ChatContainer from './ChatContainer.vue';
import { usePersonas } from '~/composables/usePersonas';

// Get personas and current user from the composable
const { personas, currentUser, getPersonaById } = usePersonas();

// Active contact (default to Claude 3.7)
const activeContact = ref(getPersonaById(2));

// Handle contact selection from sidebar
const handleContactSelect = (contact) => {
  activeContact.value = contact;
};
</script>

<style scoped>
/* Make the layout fill the entire viewport */
.h-screen {
  height: 100vh;
}
</style>