import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || '/',
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || '/api')
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor';
            if (id.includes('node_modules/recharts')) return 'charts';
            if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform') || id.includes('node_modules/zod')) return 'forms';
            if (id.includes('node_modules/react-hot-toast') || id.includes('node_modules/react-datepicker')) return 'ui';
            if (id.includes('node_modules/@tanstack')) return 'query';
          },
        },
      },
      chunkSizeWarningLimit: 400,
    },
  }
})
