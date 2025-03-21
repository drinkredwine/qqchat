<template>
  <div class="flex h-[600px] w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Sidebar with online users -->
    <div class="w-1/3 border-r border-gray-200 flex flex-col bg-white">
      <!-- Sidebar header -->
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Chats</h1>
        <div class="mt-2 relative">
          <input 
            type="text" 
            placeholder="Search conversations" 
            class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <!-- Online users list -->
      <div class="flex-1 overflow-y-auto">
        <OnlineUser 
          v-for="user in users" 
          :key="user.id" 
          :user="user" 
          :is-active="activeUser?.id === user.id"
          @select-user="selectUser"
        />
      </div>
    </div>
    
    <!-- Chat area -->
    <div class="w-2/3 flex flex-col bg-gray-50">
      <!-- Chat header -->
      <ChatHeader v-if="activeUser" :user="activeUser" />
      <div v-else class="flex items-center justify-center h-16 border-b border-gray-200 p-4 bg-white">
        <p class="text-gray-500">Select a conversation to start chatting</p>
      </div>
      
      <!-- Messages container -->
      <div class="flex-1 p-4 overflow-y-auto" ref="messagesContainer">
        <div v-if="activeUser">
          <div class="text-center text-sm text-gray-500 my-4">{{ formattedDate }}</div>
          
          <ChatMessage 
            v-for="message in activeUserMessages" 
            :key="message.id" 
            :message="message" 
            :is-own="message.sender === 'You'"
          />
        </div>
        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="mt-4 text-gray-500 text-lg">Select a conversation to start chatting</p>
          </div>
        </div>
      </div>
      
      <!-- Chat input -->
      <ChatInput v-if="activeUser" @send-message="sendMessage" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import ChatHeader from './ChatHeader.vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import OnlineUser from './OnlineUser.vue';

// Mock data for users
const users = ref([
  {
    id: '1',
    name: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'online',
    lastActive: 'Active now',
    lastMessage: 'Hey, how are you doing?',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'online',
    lastActive: 'Active now',
    lastMessage: 'Can we meet tomorrow?',
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    status: 'idle',
    lastActive: '30m ago',
    lastMessage: 'I sent you the documents',
    unreadCount: 0
  },
  {
    id: '4',
    name: 'Mike Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    status: 'offline',
    lastActive: '2h ago',
    lastMessage: 'Thanks for your help!',
    unreadCount: 0
  },
  {
    id: '5',
    name: 'Alex Morgan',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    status: 'online',
    lastActive: 'Active now',
    lastMessage: 'Let me check and get back to you',
    unreadCount: 0
  }
]);

// Mock messages data
const messages = ref({
  '1': [
    {
      id: '101',
      sender: 'Jane Smith',
      text: 'Hey there! How are you doing today?',
      time: '10:32 AM'
    },
    {
      id: '102',
      sender: 'You',
      text: 'I\'m doing great! Just finished that project we were working on.',
      time: '10:34 AM'
    },
    {
      id: '103',
      sender: 'Jane Smith',
      text: 'That\'s awesome! Can you send me the final files when you get a chance?',
      time: '10:36 AM'
    },
    {
      id: '104',
      sender: 'You',
      text: 'Sure, I\'ll email them to you right away.',
      time: '10:37 AM'
    },
    {
      id: '105',
      sender: 'Jane Smith',
      text: 'Perfect! Also, are we still on for the meeting tomorrow at 2pm?',
      time: '10:39 AM'
    }
  ],
  '2': [
    {
      id: '201',
      sender: 'John Doe',
      text: 'Hi there, do you have time to discuss the new design?',
      time: '9:15 AM'
    },
    {
      id: '202',
      sender: 'You',
      text: 'Sure, what aspects would you like to focus on?',
      time: '9:18 AM'
    },
    {
      id: '203',
      sender: 'John Doe',
      text: 'Can we meet tomorrow to go over the color scheme and layout?',
      time: '9:20 AM'
    }
  ],
  '3': [
    {
      id: '301',
      sender: 'Sarah Johnson',
      text: 'I just sent you the documents you requested.',
      time: 'Yesterday'
    },
    {
      id: '302',
      sender: 'You',
      text: 'Got them, thanks! I\'ll review them today.',
      time: 'Yesterday'
    },
    {
      id: '303',
      sender: 'Sarah Johnson',
      text: 'Great! Let me know if you need anything else.',
      time: 'Yesterday'
    }
  ],
  '4': [
    {
      id: '401',
      sender: 'You',
      text: 'Mike, can you help me with the server configuration?',
      time: 'Monday'
    },
    {
      id: '402',
      sender: 'Mike Wilson',
      text: 'Of course! What specific issues are you having?',
      time: 'Monday'
    },
    {
      id: '403',
      sender: 'You',
      text: 'I can\'t get the authentication middleware to work properly.',
      time: 'Monday'
    },
    {
      id: '404',
      sender: 'Mike Wilson',
      text: 'I\'ll take a look at it and get back to you with a solution.',
      time: 'Monday'
    },
    {
      id: '405',
      sender: 'You',
      text: 'Thank you so much!',
      time: 'Monday'
    },
    {
      id: '406',
      sender: 'Mike Wilson',
      text: 'No problem! Happy to help.',
      time: 'Monday'
    }
  ],
  '5': [
    {
      id: '501',
      sender: 'Alex Morgan',
      text: 'Have you reviewed the latest analytics report?',
      time: 'Tuesday'
    },
    {
      id: '502',
      sender: 'You',
      text: 'Not yet, is there something specific I should look at?',
      time: 'Tuesday'
    },
    {
      id: '503',
      sender: 'Alex Morgan',
      text: 'The conversion rates have improved significantly since our last update.',
      time: 'Tuesday'
    },
    {
      id: '504',
      sender: 'You',
      text: 'That\'s great news! I\'ll check it out right away.',
      time: 'Tuesday'
    },
    {
      id: '505',
      sender: 'Alex Morgan',
      text: 'Let me know your thoughts once you\'ve had a chance to review it.',
      time: 'Tuesday'
    }
  ]
});

const activeUser = ref(null);
const messagesContainer = ref(null);

// Format current date for message grouping
const formattedDate = computed(() => {
  const today = new Date();
  return today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

// Get messages for active user
const activeUserMessages = computed(() => {
  if (!activeUser.value) return [];
  return messages.value[activeUser.value.id] || [];
});

// Select a user to chat with
const selectUser = (userId) => {
  activeUser.value = users.value.find(user => user.id === userId);
  
  // Reset unread count when selecting a user
  if (activeUser.value) {
    const userIndex = users.value.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users.value[userIndex].unreadCount = 0;
    }
  }
  
  // Scroll to bottom of messages
  nextTick(() => {
    scrollToBottom();
  });
};

// Send a new message
const sendMessage = (text) => {
  if (!activeUser.value) return;
  
  const newMessage = {
    id: Date.now().toString(),
    sender: 'You',
    text: text,
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  };
  
  if (!messages.value[activeUser.value.id]) {
    messages.value[activeUser.value.id] = [];
  }
  
  messages.value[activeUser.value.id].push(newMessage);
  
  // Update last message in user list
  const userIndex = users.value.findIndex(u => u.id === activeUser.value.id);
  if (userIndex !== -1) {
    users.value[userIndex].lastMessage = text;
  }
  
  // Scroll to bottom of messages
  nextTick(() => {
    scrollToBottom();
  });
};

// Scroll to bottom of messages container
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Auto-scroll to bottom when messages change
watch(activeUserMessages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

// Select first user by default
selectUser(users.value[0].id);
</script>