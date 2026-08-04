import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The static prompt dataset is large; split it into its own chunk so the
    // app shell stays small and the data can be cached independently.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
          cases: ['./src/data/cases.json'],
        },
      },
    },
    // The cases chunk holds the full static prompt dataset (517 entries) and is
    // expected to be large; silence the warning for that data-only asset.
    chunkSizeWarningLimit: 800,
  },
})
