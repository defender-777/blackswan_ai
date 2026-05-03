import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  // Production build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react']
        }
      }
    }
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    host: true,
    strictPort: false,
  },
  
  // Preview configuration for production testing
  preview: {
    port: 8080,
    host: true,
    strictPort: false,
  }
})

// Made with Bob