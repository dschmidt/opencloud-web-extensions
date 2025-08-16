import { defineConfig } from '@opencloud-eu/extension-sdk'
import { readFileSync } from 'fs'
export default defineConfig({
  name: 'web-app-keepass',
  server: {
    port: 9726
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'keepass.js'
      }
    }
  },
  plugins: [
    {
      name: 'base64-loader',
      transform(_: any, id: string) {
        console.log('base64-loader', id)
        const [path, query] = id.split('?')
        if (query != 'base64') return null

        const data = readFileSync(path)
        const base64 = data.toString('base64')

        return `export default '${base64}';`
      }
    }
  ],
  test: {
    exclude: ['**/e2e/**']
  }
})
