import { ref, reactive } from 'vue';
import { useChat } from './useChat';

// Agent workflow states
const AGENT_STATES = {
  IDLE: 'idle',
  ANALYZING: 'analyzing',
  PLANNING: 'planning',
  EXECUTING: 'executing',
  SUMMARIZING: 'summarizing',
  COMPLETE: 'complete',
  ERROR: 'error'
};

// Agent workflow steps
const WORKFLOW_STEPS = [
  { id: 'analyze', name: 'Analyze Question', description: 'Understanding the query and identifying key components' },
  { id: 'plan', name: 'Create Plan', description: 'Developing a step-by-step approach to solve the problem' },
  { id: 'execute', name: 'Execute Steps', description: 'Working through each step of the plan' },
  { id: 'summarize', name: 'Summarize Results', description: 'Compiling findings into a comprehensive answer' }
];

export function useAgentWorkflow() {
  const { sendMessage: sendChatMessage } = useChat();
  
  // Current workflow state
  const currentState = ref(AGENT_STATES.IDLE);
  
  // Current workflow step
  const currentStep = ref(0);
  
  // Workflow steps with progress
  const workflowSteps = ref([...WORKFLOW_STEPS]);
  
  // Execution plan
  const executionPlan = ref([]);
  
  // Current execution step
  const currentExecutionStep = ref(0);
  
  // Analysis results
  const analysisResults = ref('');
  
  // Final summary
  const finalSummary = ref('');
  
  // Is the agent currently working
  const isWorking = ref(false);
  
  // Error message if any
  const errorMessage = ref('');
  
  // Reset the workflow
  const resetWorkflow = () => {
    currentState.value = AGENT_STATES.IDLE;
    currentStep.value = 0;
    workflowSteps.value = [...WORKFLOW_STEPS];
    executionPlan.value = [];
    currentExecutionStep.value = 0;
    analysisResults.value = '';
    finalSummary.value = '';
    isWorking.value = false;
    errorMessage.value = '';
  };
  
  // Check if a question is complex enough to warrant the agentic workflow
  const isComplexQuestion = (question) => {
    // Check question length (complex questions tend to be longer)
    if (question.length < 50) return false;
    
    // Check for keywords that suggest complexity
    const complexityKeywords = [
      'analyze', 'compare', 'contrast', 'explain', 'evaluate', 
      'synthesize', 'investigate', 'research', 'steps', 'process',
      'how would', 'how could', 'what if', 'why does', 'multiple',
      'complex', 'complicated', 'difficult', 'challenging', 'intricate',
      'design', 'create', 'develop', 'implement', 'build',
      'optimize', 'improve', 'enhance', 'solve', 'fix'
    ];
    
    const questionLower = question.toLowerCase();
    const hasComplexityKeywords = complexityKeywords.some(keyword => 
      questionLower.includes(keyword)
    );
    
    // Check for question marks (multiple questions tend to be complex)
    const questionMarkCount = (question.match(/\\?/g) || []).length;
    
    return hasComplexityKeywords || questionMarkCount > 1;
  };
  
  // Start the agent workflow for a complex question
  const startAgentWorkflow = async (question, personaId, updateCallback) => {
    try {
      resetWorkflow();
      isWorking.value = true;
      
      // Step 1: Analyze the question
      currentState.value = AGENT_STATES.ANALYZING;
      currentStep.value = 0;
      updateCallback({
        type: 'workflow-update',
        state: currentState.value,
        step: currentStep.value,
        message: 'Analyzing your question...'
      });
      
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
      
      const analysisResponse = await sendChatMessage([
        { role: 'user', content: analysisPrompt }
      ], false);
      
      analysisResults.value = analysisResponse.response[0].content;
      
      updateCallback({
        type: 'analysis-complete',
        analysis: analysisResults.value
      });
      
      // Step 2: Create a plan
      currentState.value = AGENT_STATES.PLANNING;
      currentStep.value = 1;
      updateCallback({
        type: 'workflow-update',
        state: currentState.value,
        step: currentStep.value,
        message: 'Creating a plan to answer your question...'
      });
      
      const planningPrompt = `
        Based on this analysis of the question:
        "${analysisResults.value}"
        
        Create a step-by-step plan to answer the original question:
        "${question}"
        
        For each step:
        1. Provide a clear title
        2. Explain what needs to be done
        3. Specify what information or result should be produced
        
        Format your response as a numbered list of steps without any introduction or conclusion.
        Limit your plan to 3-5 concrete steps.
      `;
      
      const planningResponse = await sendChatMessage([
        { role: 'user', content: planningPrompt }
      ], false);
      
      // Parse the plan into discrete steps
      const planText = planningResponse.response[0].content;
      const planSteps = parsePlanSteps(planText);
      executionPlan.value = planSteps;
      
      updateCallback({
        type: 'plan-complete',
        plan: executionPlan.value
      });
      
      // Step 3: Execute the plan
      currentState.value = AGENT_STATES.EXECUTING;
      currentStep.value = 2;
      
      // Execute each step in the plan
      const stepResults = [];
      
      for (let i = 0; i < executionPlan.value.length; i++) {
        currentExecutionStep.value = i;
        const step = executionPlan.value[i];
        
        updateCallback({
          type: 'execution-step-start',
          stepIndex: i,
          step: step
        });
        
        const stepPrompt = `
          You are executing step ${i + 1} of a plan to answer this question:
          "${question}"
          
          The full plan is:
          ${executionPlan.value.map((s, idx) => `${idx + 1}. ${s.title}: ${s.description}`).join('\\n')}
          
          Your current task is:
          Step ${i + 1}: ${step.title}
          ${step.description}
          
          ${i > 0 ? `Previous step results:\\n${stepResults.map((r, idx) => `Step ${idx + 1}: ${r}`).join('\\n')}` : ''}
          
          Execute this step thoroughly and provide a detailed result.
          Focus only on this specific step, not the entire question.
        `;
        
        const stepResponse = await sendChatMessage([
          { role: 'user', content: stepPrompt }
        ], false);
        
        const stepResult = stepResponse.response[0].content;
        stepResults.push(stepResult);
        executionPlan.value[i].result = stepResult;
        
        updateCallback({
          type: 'execution-step-complete',
          stepIndex: i,
          result: stepResult
        });
      }
      
      // Step 4: Summarize the results
      currentState.value = AGENT_STATES.SUMMARIZING;
      currentStep.value = 3;
      updateCallback({
        type: 'workflow-update',
        state: currentState.value,
        step: currentStep.value,
        message: 'Summarizing the results...'
      });
      
      const summaryPrompt = `
        Based on the completed plan to answer this question:
        "${question}"
        
        With these step-by-step results:
        ${executionPlan.value.map((step, idx) => 
          `Step ${idx + 1}: ${step.title}\\nResult: ${step.result}`
        ).join('\\n\\n')}
        
        Provide a comprehensive final answer to the original question.
        Make sure to integrate insights from all steps.
        Format your response in a clear, well-structured way.
      `;
      
      const summaryResponse = await sendChatMessage([
        { role: 'user', content: summaryPrompt }
      ], false);
      
      finalSummary.value = summaryResponse.response[0].content;
      
      // Complete the workflow
      currentState.value = AGENT_STATES.COMPLETE;
      isWorking.value = false;
      
      updateCallback({
        type: 'workflow-complete',
        summary: finalSummary.value
      });
      
      return {
        analysis: analysisResults.value,
        plan: executionPlan.value,
        summary: finalSummary.value,
        success: true
      };
      
    } catch (error) {
      console.error('Agent workflow error:', error);
      currentState.value = AGENT_STATES.ERROR;
      errorMessage.value = error.message || 'An error occurred during the agent workflow';
      isWorking.value = false;
      
      updateCallback({
        type: 'workflow-error',
        error: errorMessage.value
      });
      
      return {
        error: errorMessage.value,
        success: false
      };
    }
  };
  
  // Helper function to parse plan steps from text
  const parsePlanSteps = (planText) => {
    const steps = [];
    const stepRegex = /(\d+)[.:\)]\s*([^\n]+)(?:\n|$)(?:([^]*?)(?=\d+[.:\)]|\s*$))?/g;
    
    let match;
    while ((match = stepRegex.exec(planText)) !== null) {
      const stepNumber = match[1];
      const stepTitle = match[2].trim();
      const stepDescription = match[3] ? match[3].trim() : '';
      
      steps.push({
        number: parseInt(stepNumber),
        title: stepTitle,
        description: stepDescription,
        result: '',
        status: 'pending'
      });
    }
    
    // If regex failed to parse steps, create a simple fallback
    if (steps.length === 0) {
      const lines = planText.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && /^\d+/.test(line)) {
          steps.push({
            number: steps.length + 1,
            title: line.replace(/^\d+[.:\)]/, '').trim(),
            description: '',
            result: '',
            status: 'pending'
          });
        }
      }
    }
    
    return steps;
  };
  
  return {
    currentState,
    currentStep,
    workflowSteps,
    executionPlan,
    currentExecutionStep,
    analysisResults,
    finalSummary,
    isWorking,
    errorMessage,
    isComplexQuestion,
    startAgentWorkflow,
    resetWorkflow,
    AGENT_STATES,
    WORKFLOW_STEPS
  };
}