<template>
  <div 
    class="flex items-center p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-100"
    :class="{ 'bg-blue-50': isActive }"
    @click="$emit('select-user', user.id)"
  >
    <!-- User avatar with status indicator -->
    <div class="relative mr-3">
      <img 
        :src="user.avatar" 
        :alt="user.name" 
        class="h-12 w-12 rounded-full object-cover border border-gray-200"
      />
      <div 
        class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white"
        :class="{
          'bg-green-500': user.status === 'online',
          'bg-yellow-500': user.status === 'idle',
          'bg-gray-400': user.status === 'offline'
        }"
      ></div>
    </div>
    
    <!-- User info -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-baseline">
        <h3 class="text-base font-medium text-gray-900 truncate">{{ user.name }}</h3>
        <span class="text-xs text-gray-500">{{ user.lastActive }}</span>
      </div>
      <p class="text-sm text-gray-500 truncate" v-if="user.lastMessage">
        {{ user.lastMessage }}
      </p>
    </div>
    
    <!-- Unread message indicator -->
    <div v-if="user.unreadCount > 0" class="ml-2 bg-blue-500 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
      {{ user.unreadCount }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      avatar: '',
      status: 'offline',
      lastActive: '',
      lastMessage: '',
      unreadCount: 0
    })
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select-user']);
</script>