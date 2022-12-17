import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    lib: {
      entry: 'src/App.tsx',
      formats: ['es'],
    },
    rollupOptions: {
      
    }
  }
})