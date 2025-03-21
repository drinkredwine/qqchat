# Agent Workflow Implementation

## Overview
This document explains the implementation of an agentic workflow for handling complex questions. The system analyzes questions, creates a plan, and executes it step by step with multiple LLM calls, displaying the process visually in the chat interface.

## Key Components

### 1. Agent Workflow Composable
The `useAgentWorkflow.js` composable provides the core functionality:
- Detects complex questions that require multi-step reasoning
- Implements a state machine for the workflow (analyze, plan, execute, summarize)
- Manages the execution of multiple API calls to complete the process
- Tracks progress and intermediate results

```javascript
// Example workflow states
const AGENT_STATES = {
  IDLE: 'idle',
  ANALYZING: 'analyzing',
  PLANNING: 'planning',
  EXECUTING: 'executing',
  SUMMARIZING: 'summarizing',
  COMPLETE: 'complete',
  ERROR: 'error'
};
```

### 2. Visual Workflow Representation
The `AgentWorkflow.vue` component provides a visual representation of the agent's progress:
- Shows the current state of the workflow
- Displays a step indicator for the four main phases
- Reveals analysis results, execution plan, and final summary
- Provides real-time updates as the agent works

```vue
<div class="agent-workflow bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4 w-full">
  <!-- Workflow header -->
  <div class="flex items-center justify-between mb-4">...</div>
  
  <!-- Workflow steps progress -->
  <div class="mb-6">...</div>
  
  <!-- Current state display -->
  <div v-if="currentState !== AGENT_STATES.IDLE" class="mb-4">...</div>
  
  <!-- Analysis results -->
  <div v-if="analysisResults && currentStep > 0" class="mb-4">...</div>
  
  <!-- Execution plan -->
  <div v-if="executionPlan.length > 0 && currentStep > 1" class="mb-4">...</div>
  
  <!-- Final summary -->
  <div v-if="finalSummary && currentState === AGENT_STATES.COMPLETE" class="mb-2">...</div>
</div>
```

### 3. Complex Question Detection
The system automatically detects questions that would benefit from the agent workflow:
- Checks for question length and complexity
- Identifies keywords that suggest a complex problem
- Counts question marks to detect multi-part questions

```javascript
// Check if a question is complex enough to warrant the agentic workflow
const isComplexQuestion = (question) => {
  // Check question length (complex questions tend to be longer)
  if (question.length < 50) return false;
  
  // Check for keywords that suggest complexity
  const complexityKeywords = [
    'analyze', 'compare', 'contrast', 'explain', 'evaluate', 
    // Additional keywords...
  ];
  
  const questionLower = question.toLowerCase();
  const hasComplexityKeywords = complexityKeywords.some(keyword => 
    questionLower.includes(keyword)
  );
  
  // Check for question marks (multiple questions tend to be complex)
  const questionMarkCount = (question.match(/\\?/g) || []).length;
  
  return hasComplexityKeywords || questionMarkCount > 1;
};
```

## Implementation Details

### Multi-Step Process
The agent workflow follows a structured approach:

1. **Analysis Phase**:
   - Breaks down the question into components
   - Identifies the key topics and requirements
   - Determines what knowledge domains are needed

2. **Planning Phase**:
   - Creates a step-by-step plan to solve the problem
   - Defines clear objectives for each step
   - Sets up a structured approach to the solution

3. **Execution Phase**:
   - Works through each step in the plan
   - Makes individual API calls for each step
   - Tracks progress and intermediate results

4. **Summary Phase**:
   - Compiles the results from all steps
   - Creates a comprehensive final answer
   - Presents the solution in a clear format

### LLM Prompting Strategy
The system uses carefully crafted prompts for each phase:

```javascript
// Example analysis prompt
const analysisPrompt = `
  Analyze the following question in detail:
  "${question}"
  
  Identify:
  1. The main topic or subject
  2. The specific task or question type
  3. Any constraints or requirements
  4. Required knowledge domains
  5. Potential sub-questions that need to be answered
  
  Format your response as a structured analysis without any introduction or conclusion.
`;
```

### Integration with Chat Interface
The agent workflow is seamlessly integrated into the chat experience:
- Complex questions automatically trigger the workflow
- The workflow visualization appears above the assistant's message
- Users can see the agent's thought process in real-time
- The final answer appears as a normal message when complete

## User Experience Benefits

1. **Transparency**: Users can see how the AI approaches complex problems
2. **Educational Value**: The step-by-step process helps users understand the reasoning
3. **Better Answers**: Breaking down complex questions leads to more thorough responses
4. **Engaging Interface**: The visual workflow makes the AI's work more engaging to follow

## Future Improvements

Potential enhancements include:
1. User control to explicitly request or skip the agent workflow
2. Support for user feedback during the workflow process
3. More advanced visualization of relationships between concepts
4. Ability to expand/collapse different sections of the workflow
5. Option to save and reference past workflow results