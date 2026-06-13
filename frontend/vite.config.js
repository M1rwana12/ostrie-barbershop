import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// На GitHub Pages сайт живе за /ostrie-barbershop/, тож для production-білду
// потрібен відповідний base. У dev лишаємо корінь '/'.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/ostrie-barbershop/' : '/',
  server: { port: 5173, host: true },
}))
