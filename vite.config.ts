import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    envDir: process.cwd(),

    plugins: [react()],

    define: {
      'import.meta.env.VITE_WS_URL': JSON.stringify(
        env.VITE_WS_URL || 'ws://172.20.10.6:1234'
      ),
    },

    server: {
      port: 5173,
      host: true,

      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  }
})