import { ref, reactive } from 'vue';

// Define the AI personas with distinct personalities
const personas = reactive([
  {
    id: 2,
    name: 'Claude 3.7',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isOnline: true,
    personality: 'Thoughtful, nuanced, and balanced',
    specialty: 'General knowledge and reasoning',
    greeting: 'Hello! I\'m Claude 3.7, Anthropic\'s most capable AI assistant. I can help with a wide range of tasks, from creative writing to complex reasoning. What can I assist you with today?',
    conversationStyle: 'Detailed and comprehensive',
    messages: [],
    lastMessage: {
      content: 'It\'s a web application with a modern chat interface.',
      timestamp: new Date(Date.now() - 1200000),
    }
  },
  {
    id: 3,
    name: 'Claude 3 Opus',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isOnline: true,
    personality: 'Intellectual, analytical, and thorough',
    specialty: 'Complex reasoning and detailed analysis',
    greeting: 'Greetings! I\'m Claude 3 Opus, designed for deep intellectual tasks. I excel at complex reasoning, detailed analysis, and nuanced understanding. How may I assist with your more challenging questions?',
    conversationStyle: 'Academic and precise',
    messages: [],
    lastMessage: {
      content: 'I can help you with that research project.',
      timestamp: new Date(Date.now() - 3600000),
    }
  },
  {
    id: 4,
    name: 'Claude 3 Sonnet',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isOnline: false,
    personality: 'Balanced, practical, and efficient',
    specialty: 'Everyday tasks and general assistance',
    greeting: 'Hi there! I\'m Claude 3 Sonnet, a balanced AI assistant that offers a good mix of intelligence and efficiency. I can help with a wide range of everyday tasks. What would you like help with?',
    conversationStyle: 'Clear and concise',
    messages: [],
    lastMessage: {
      content: 'Let me check those calculations for you.',
      timestamp: new Date(Date.now() - 86400000),
    }
  },
  {
    id: 5,
    name: 'Claude 3 Haiku',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isOnline: true,
    personality: 'Concise, direct, and simple',
    specialty: 'Quick answers and basic tasks',
    greeting: 'Hey! Claude 3 Haiku here. I\'m quick and to the point. Need a fast answer? I\'m your AI.',
    conversationStyle: 'Brief and straightforward',
    messages: [],
    lastMessage: {
      content: 'Simple answers, quickly delivered.',
      timestamp: new Date(Date.now() - 172800000),
    }
  },
  {
    id: 6,
    name: 'GPT-4',
    avatar: 'https://i.pravatar.cc/150?img=6',
    isOnline: true,
    personality: 'Creative, technical, and versatile',
    specialty: 'Code generation and creative tasks',
    greeting: 'Hello! I\'m GPT-4, OpenAI\'s advanced language model. I excel at coding tasks, creative writing, and technical explanations. How can I assist you with your projects today?',
    conversationStyle: 'Technical and creative',
    messages: [],
    lastMessage: {
      content: 'I can generate some code examples for you.',
      timestamp: new Date(Date.now() - 259200000),
    }
  },
  {
    id: 7,
    name: 'GPT-3.5',
    avatar: 'https://i.pravatar.cc/150?img=7',
    isOnline: false,
    personality: 'Helpful, straightforward, and accessible',
    specialty: 'General assistance and basic tasks',
    greeting: 'Hi! I\'m GPT-3.5, a helpful AI assistant. I can provide information, summarize content, and assist with many everyday tasks. What can I help you with?',
    conversationStyle: 'Friendly and accessible',
    messages: [],
    lastMessage: {
      content: 'Here\'s a quick summary of that article.',
      timestamp: new Date(Date.now() - 345600000),
    }
  },
  {
    id: 8,
    name: 'Gemini Pro',
    avatar: 'https://i.pravatar.cc/150?img=8',
    isOnline: true,
    personality: 'Data-driven, analytical, and visual',
    specialty: 'Multimodal understanding and data analysis',
    greeting: 'Hello! I\'m Gemini Pro, Google\'s multimodal AI. I excel at understanding both text and visual information, and can help with data analysis, pattern recognition, and more. What would you like to explore today?',
    conversationStyle: 'Visual and analytical',
    messages: [],
    lastMessage: {
      content: 'I can analyze that data for patterns.',
      timestamp: new Date(Date.now() - 432000000),
    }
  },
  {
    id: 9,
    name: 'Llama 3',
    avatar: 'https://i.pravatar.cc/150?img=9',
    isOnline: false,
    personality: 'Open, community-focused, and evolving',
    specialty: 'Open-source applications and community projects',
    greeting: 'Hi there! I\'m Llama 3, an open-source AI assistant from Meta. I\'m designed to be helpful, harmless, and honest. I\'m particularly good at helping with open-source projects and community-focused tasks. How can I assist you today?',
    conversationStyle: 'Community-oriented and collaborative',
    messages: [],
    lastMessage: {
      content: 'Open-source models are improving rapidly.',
      timestamp: new Date(Date.now() - 518400000),
    }
  }
]);

// Current user data
const currentUser = ref({
  id: 1,
  name: 'Current User',
  avatar: 'https://i.pravatar.cc/150?img=1'
});

// Initialize conversations for each persona
const initializeConversations = () => {
  personas.forEach(persona => {
    // Only initialize if no messages exist yet
    if (persona.messages.length === 0) {
      // Create initial greeting message from the AI
      persona.messages = [
        {
          id: 1,
          content: persona.greeting,
          timestamp: new Date(Date.now() - 60000),
          senderId: persona.id,
          status: 'read'
        }
      ];
    }
  });
};

// Get all personas
const getPersonas = () => {
  return personas;
};

// Get a specific persona by ID
const getPersonaById = (id) => {
  return personas.find(persona => persona.id === id);
};

// Add a message to a specific persona's conversation
const addMessageToPersona = (personaId, message) => {
  const persona = getPersonaById(personaId);
  if (persona) {
    // Add the message
    persona.messages.push(message);
    
    // Update last message
    if (message.senderId !== currentUser.value.id) {
      persona.lastMessage = {
        content: message.content,
        timestamp: message.timestamp
      };
    }
    
    return true;
  }
  return false;
};

// Generate a response based on persona's personality
const generatePersonaResponse = (personaId, userMessage) => {
  const persona = getPersonaById(personaId);
  if (!persona) return null;
  
  // Create a response message with content based on persona's personality
  let responseContent = '';
  
  switch (persona.name) {
    case 'Claude 3.7':
      responseContent = `I've considered your message carefully. ${getThoughtfulResponse(userMessage)}`;
      break;
    case 'Claude 3 Opus':
      responseContent = `From an analytical perspective, ${getAnalyticalResponse(userMessage)}`;
      break;
    case 'Claude 3 Sonnet':
      responseContent = `${getPracticalResponse(userMessage)}`;
      break;
    case 'Claude 3 Haiku':
      responseContent = `${getConciseResponse(userMessage)}`;
      break;
    case 'GPT-4':
      responseContent = `${getCreativeResponse(userMessage)}`;
      break;
    case 'GPT-3.5':
      responseContent = `${getHelpfulResponse(userMessage)}`;
      break;
    case 'Gemini Pro':
      responseContent = `Based on the data, ${getDataDrivenResponse(userMessage)}`;
      break;
    case 'Llama 3':
      responseContent = `From an open-source perspective, ${getOpenSourceResponse(userMessage)}`;
      break;
    default:
      responseContent = `I understand. Let me respond to your message about "${userMessage.substring(0, 30)}..."`;
  }
  
  return {
    id: persona.messages.length + 2, // +1 for user message that will be added first
    content: responseContent,
    timestamp: new Date(),
    senderId: persona.id,
    status: 'delivered'
  };
};

// Helper functions for persona-specific responses
const getThoughtfulResponse = (message) => {
  return `I see multiple perspectives on this. On one hand, ${message.length > 20 ? 'your detailed message suggests' : 'this could mean'} you're looking for a comprehensive answer. On the other hand, you might prefer a concise summary. I'll try to balance both in my response while ensuring I address the core of your question.`;
};

const getAnalyticalResponse = (message) => {
  return `This presents an interesting analytical challenge. Let me break this down systematically: first, the premise of your question contains ${message.split(' ').length} words, suggesting a complexity level that requires a multi-faceted approach. I'll analyze this from several theoretical frameworks to provide you with a comprehensive understanding.`;
};

const getPracticalResponse = (message) => {
  return `Here's a practical approach to address your question. I'll give you a straightforward answer with actionable steps you can take right away. The key points to consider are relevance, efficiency, and practical application.`;
};

const getConciseResponse = (message) => {
  return `Quick answer: ${message.split(' ').length > 10 ? 'Your question has multiple parts. Let me address each briefly.' : 'Here\'s what you need to know.'} No fluff, just the essential information.`;
};

const getCreativeResponse = (message) => {
  return `This sparks some creative possibilities! I could approach this from a technical angle with code examples, or we could explore more imaginative solutions. Let me show you both paths and you can decide which direction you prefer.`;
};

const getHelpfulResponse = (message) => {
  return `I'd be happy to help with that! Let me provide a clear explanation that addresses your question about "${message.substring(0, 20)}..." in a way that's easy to understand and apply.`;
};

const getDataDrivenResponse = (message) => {
  return `I notice patterns in your query that suggest a ${message.length > 30 ? 'complex' : 'straightforward'} data structure. If we visualize this as a problem space, we could identify key variables and their relationships to derive an optimal solution approach.`;
};

const getOpenSourceResponse = (message) => {
  return `The community has developed several approaches to questions like this. Drawing from open-source knowledge, I can suggest solutions that are transparent, collaborative, and built on shared expertise.`;
};

export function usePersonas() {
  // Initialize conversations when the composable is first used
  initializeConversations();
  
  return {
    personas,
    currentUser,
    getPersonas,
    getPersonaById,
    addMessageToPersona,
    generatePersonaResponse
  };
}