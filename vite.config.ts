import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
    
  },
  // server:{
  //   host: '0.0.0.0', // Vite serverga har qanday tashqi kirishga ruxsat beradi
  //   port: 5173,
  //   allowedHosts: ['all'], // Ngrok kabi domenlarga ruxsat
  //   strictPort: true,       // Port o‘zgarmasligiga kafolat
  //   cors: true,  
  //   // proxy: {
  //   //   '/api': {
  //   //     target: 'http://localhost:8000',
  //   //     changeOrigin: true,
  //   //     secure: false,
  //   //     rewrite: (path) => path.replace(/^\/api/, '')
  //   //   }
  //   // }
  // }
})
