import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // إضافة الـ base بتضمن إن المسارات تبدأ من الجذر (Root)
  base: './', 
  build: {
    // ده بيساعد في تقليل أخطاء الـ Minification اللي بتطلع لك (m is not defined)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // سيبها false عشان لو فيه errors تظهر لك في الـ console
      },
    },
  },
})