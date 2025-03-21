// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      title: 'Facebook-Style Chat',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern chat interface built with Nuxt.js and Tailwind CSS' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/fira-code@6.2.0/distr/fira_code.css' }
      ]
    }
  },
  devServer: {
		port: 3011
  },
  // Enable pages directory
  pages: true,

  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    injectPosition: 0,
    viewer: false,
  },

  // Monaco Editor configuration
  build: {
    transpile: ['monaco-editor']
  },

  // Vite configuration for Monaco Editor
  vite: {
    define: {
      'process.env.MONACO_EDITOR_VERSION': JSON.stringify(require('monaco-editor/package.json').version)
    },
    optimizeDeps: {
      include: ['monaco-editor']
    }
  },

  compatibilityDate: '2025-03-21'
})
