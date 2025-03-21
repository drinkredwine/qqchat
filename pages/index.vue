<template>
  <div>
    <!-- Immersive Chat Layout -->
    <ImmersiveChatLayout />
    
    <!-- Original demo components (hidden) -->
    <div class="hidden">
      <TailwindCard />
      <TailwindFeatures />
    </div>
  </div>
</template>

<script setup>
import ImmersiveChatLayout from '~/components/chat/ImmersiveChatLayout.vue';

// Page metadata
useHead({
  title: 'AI Chat Interface',
  meta: [
    { 
      name: 'description', 
      content: 'An immersive chat interface built with Nuxt.js and Tailwind CSS. Experience seamless communication with various AI assistants.' 
    }
  ]
});
</script>