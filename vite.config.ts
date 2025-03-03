// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Add any needed aliases here
    }
  },
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet']
  }
})