import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/sebastian-codeBase/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
	server: {
		host: '0.0.0.0', // ⬅ 讓外部可訪問（例如你的主機 localhost）
		port: 4001 ,       // ⬅ 改這裡
  	},
})
