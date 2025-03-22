<template>
  <div class="agent-workflow bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4 w-full">
    <!-- Workflow header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        <span v-if="isWorking" class="text-blue-600">AI Agent Workflow</span>
        <span v-else-if="currentState === AGENT_STATES.COMPLETE" class="text-green-600">AI Agent Workflow (Complete)</span>
        <span v-else-if="currentState === AGENT_STATES.ERROR" class="text-red-600">AI Agent Workflow (Error)</span>
        <span v-else>AI Agent Workflow</span>
      </h3>
      <div class="flex items-center">
        <span v-if="isWorking" class="inline-block h-3 w-3 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
        <span v-else-if="currentState === AGENT_STATES.COMPLETE" class="inline-block h-3 w-3 rounded-full bg-green-500 mr-2"></span>
        <span v-else-if="currentState === AGENT_STATES.ERROR" class="inline-block h-3 w-3 rounded-full bg-red-500 mr-2"></span>
      </div>
    </div>
    
    <!-- Workflow steps progress -->
    <div class="mb-6">
      <div class="flex justify-between mb-2">
        <div v-for="(step, index) in workflowSteps" :key="index" class="flex flex-col items-center">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="getStepClasses(index)"
          >
            {{ index + 1 }}
          </div>
          <span class="text-xs mt-1 text-center max-w-[80px]">{{ step.name }}</span>
        </div>
      </div>
      <div class="relative h-1 bg-gray-200 rounded-full mt-2">
        <div 
          class="absolute top-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-500"
          :style="{ width: `${(currentStep / (workflowSteps.length - 1)) * 100}%` }"
        ></div>
      </div>
    </div>
    
    <!-- Current state display -->
    <div v-if="currentState !== AGENT_STATES.IDLE" class="mb-4">
      <div v-if="currentState === AGENT_STATES.ANALYZING" class="bg-blue-50 p-3 rounded-md">
        <h4 class="font-medium text-blue-700 mb-1">Analyzing Question</h4>
        <p class="text-sm text-blue-600">Breaking down the question to understand its components...</p>
      </div>
      
      <div v-else-if="currentState === AGENT_STATES.PLANNING" class="bg-blue-50 p-3 rounded-md">
        <h4 class="font-medium text-blue-700 mb-1">Creating Plan</h4>
        <p class="text-sm text-blue-600">Developing a step-by-step approach to solve the problem...</p>
      </div>
      
      <div v-else-if="currentState === AGENT_STATES.EXECUTING" class="bg-blue-50 p-3 rounded-md">
        <h4 class="font-medium text-blue-700 mb-1">Executing Plan: Step {{ currentExecutionStep + 1 }}</h4>
        <p v-if="executionPlan[currentExecutionStep]" class="text-sm text-blue-600">
          {{ executionPlan[currentExecutionStep].title }}
        </p>
      </div>
      
      <div v-else-if="currentState === AGENT_STATES.SUMMARIZING" class="bg-blue-50 p-3 rounded-md">
        <h4 class="font-medium text-blue-700 mb-1">Summarizing Results</h4>
        <p class="text-sm text-blue-600">Compiling findings into a comprehensive answer...</p>
      </div>
      
      <div v-else-if="currentState === AGENT_STATES.ERROR" class="bg-red-50 p-3 rounded-md">
        <h4 class="font-medium text-red-700 mb-1">Error Occurred</h4>
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>
    </div>
    
    <!-- Analysis results -->
    <div v-if="analysisResults && currentStep > 0" class="mb-4">
      <div class="bg-white p-3 rounded-md border border-gray-200">
        <h4 class="font-medium text-gray-700 mb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Question Analysis
        </h4>
        <div class="text-sm text-gray-600 whitespace-pre-line analysis-content">{{ analysisResults }}</div>
      </div>
    </div>
    
    <!-- Execution plan -->
    <div v-if="executionPlan.length > 0 && currentStep > 1" class="mb-4">
      <div class="bg-white p-3 rounded-md border border-gray-200">
        <h4 class="font-medium text-gray-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Execution Plan
        </h4>
        <ul class="space-y-3">
          <li v-for="(step, index) in executionPlan" :key="index" class="pl-6 relative">
            <div 
              class="absolute left-0 top-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
              :class="getExecutionStepClasses(index)"
            >
              {{ index + 1 }}
            </div>
            <h5 class="text-sm font-medium text-gray-700">{{ step.title }}</h5>
            <p class="text-xs text-gray-500 mb-1">{{ step.description }}</p>
            
            <div v-if="step.result" class="mt-2 pl-2 border-l-2 border-green-300">
              <p class="text-xs text-gray-600 whitespace-pre-line">{{ step.result }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Final summary -->
    <div v-if="currentState === AGENT_STATES.COMPLETE" class="mb-2">
      <div class="bg-green-50 p-3 rounded-md border border-green-200">
        <h4 class="font-medium text-green-700 mb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Final Answer
        </h4>
        <div v-if="finalSummary" class="text-sm text-gray-700 whitespace-pre-line">{{ finalSummary }}</div>
        <div v-else class="text-sm text-gray-700">
          Answer has been completed and is displayed in the message below.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  currentState: {
    type: String,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  },
  workflowSteps: {
    type: Array,
    required: true
  },
  executionPlan: {
    type: Array,
    required: true
  },
  currentExecutionStep: {
    type: Number,
    required: true
  },
  analysisResults: {
    type: String,
    default: ''
  },
  finalSummary: {
    type: String,
    default: ''
  },
  isWorking: {
    type: Boolean,
    required: true
  },
  errorMessage: {
    type: String,
    default: ''
  },
  AGENT_STATES: {
    type: Object,
    required: true
  }
});

// Get classes for workflow step indicators
const getStepClasses = (index) => {
  if (index < props.currentStep) {
    return 'bg-green-500 text-white'; // Completed step
  } else if (index === props.currentStep) {
    return 'bg-blue-500 text-white'; // Current step
  } else {
    return 'bg-gray-200 text-gray-600'; // Future step
  }
};

// Get classes for execution step indicators
const getExecutionStepClasses = (index) => {
  if (props.currentState !== props.AGENT_STATES.EXECUTING) {
    return index <= props.currentExecutionStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600';
  }
  
  if (index < props.currentExecutionStep) {
    return 'bg-green-500 text-white'; // Completed step
  } else if (index === props.currentExecutionStep) {
    return 'bg-blue-500 text-white'; // Current step
  } else {
    return 'bg-gray-200 text-gray-600'; // Future step
  }
};
</script>

<style scoped>
.analysis-content, .execution-content {
  max-height: 200px;
  overflow-y: auto;
}

/* Custom scrollbar */
.analysis-content::-webkit-scrollbar,
.execution-content::-webkit-scrollbar {
  width: 4px;
}

.analysis-content::-webkit-scrollbar-track,
.execution-content::-webkit-scrollbar-track {
  background: transparent;
}

.analysis-content::-webkit-scrollbar-thumb,
.execution-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

/* Animation for the working indicator */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>