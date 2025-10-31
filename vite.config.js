import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 프론트에서 /api 로 요청하면 8080으로 프록시
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 프론트에서 /worker 로 요청하면 FastAPI(8095)로 프록시
      '/worker': {
        target: 'http://127.0.0.1:8095',
        changeOrigin: true,
        secure: false,
        // /worker 접두사는 FastAPI 라우터(prefix='/worker')와 일치하므로 rewrite 없음
      },
    },
  },
})