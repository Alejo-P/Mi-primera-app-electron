import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 🔹 Usa rutas relativas en producción
  build: {
    outDir: 'dist/react',
    emptyOutDir: true
  }
})
