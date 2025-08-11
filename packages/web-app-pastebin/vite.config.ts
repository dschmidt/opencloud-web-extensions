import { defineConfig } from '@opencloud-eu/extension-sdk'

export default defineConfig({
  name: 'web-app-pastebin',
  server: {
    port: 9726
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'pastebin.js'
      }
    }
  },
  test: {
    exclude: ['**/e2e/**']
  }
})
