import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, process.cwd(), 'T1GER_');
 return {
  plugins: [react()],
  server: {
    proxy: {
      '/app': {
        target: env.T1GER_WEB_DEV_TARGET || 'http://127.0.0.1:5174',
        changeOrigin: true,
      },
      ...(env.T1GER_API_DEV_TARGET ? { '/api': { target: env.T1GER_API_DEV_TARGET, changeOrigin: true } } : {}),
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
 };
})
