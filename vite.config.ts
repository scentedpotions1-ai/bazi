import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    '__dirname': JSON.stringify(''),
    'process.env': {}
  },
  resolve: {
    alias: {
      path: 'path-browserify',
      fs: false,
    }
  },
  optimizeDeps: {
    exclude: ['geo-tz']
  }
})
