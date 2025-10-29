import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '')
  const apiHost = env.VITE_IP_API || 'localhost'
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: `http://${apiHost}:8080`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
