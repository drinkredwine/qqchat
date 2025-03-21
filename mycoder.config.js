// mycoder.config.js
export default {
  // GitHub integration
  githubMode: true,

  // Browser settings
  headless: false,
  userSession: false,
  pageFilter: 'none', // 'simple', 'none', or 'readability'

  // System browser detection settings
  browser: {
    // Whether to use system browsers or Playwright's bundled browsers
    useSystemBrowsers: true,

    // Preferred browser type (chromium, firefox, webkit)
    preferredType: 'chromium',

    // Custom browser executable path (overrides automatic detection)
    // executablePath: null, // e.g., '/path/to/chrome'
  },

  // Model settings
  provider: 'anthropic',
  model: 'claude-3-7-sonnet-20250219',
  maxTokens: 4096,
  temperature: 0.7,

  // Custom settings
  // customPrompt can be a string or an array of strings for multiple lines
  customPrompt: '',
  // Example of multiple line custom prompts:
  // customPrompt: [
  //   'Custom instruction line 1',
  //   'Custom instruction line 2',
  //   'Custom instruction line 3',
  // ],
  profile: false,
  tokenCache: true,

  // Base URL configuration (for providers that need it)
//  baseUrl: 'http://localhost:11434', // Example for Ollama

  // MCP configuration
//  mcp: {
//    servers: [
//      {
//        name: 'example',
//        url: 'https://mcp.example.com',
//        auth: {
//          type: 'bearer',
//          token: 'your-token-here',
//        },
//      },
//    ],
//    defaultResources: ['example://docs/api'],
//    defaultTools: ['example://tools/search'],
//  },
};
