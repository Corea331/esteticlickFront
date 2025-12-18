import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // CONFIGURACIÓN PARA VERCEL
  base: '/',  // Esto es crucial para rutas relativas
  
  build: {
    outDir: 'dist',  // Vercel espera esta carpeta
    sourcemap: false,  // Desactiva en producción para mejor rendimiento
    
    // Configuración de assets
    rollupOptions: {
      output: {
        // Mejor organización de assets
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  
  // Configuración del servidor (solo desarrollo)
  server: {
    port: 3000,
    strictPort: true,
  },
  
  // Previsualización
  preview: {
    port: 3000,
    strictPort: true,
  }
})
