import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'auth': ['./src/context/AuthContext.tsx'],
          'dashboard': ['./src/pages/Dashboard.tsx'],
          'courses': ['./src/pages/Courses.tsx'],
        }
      }
    }
  }
})
