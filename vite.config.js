import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ostoreComponents',
      fileName: (format) => `ostoreComponents.${format}.js`
    },
    rollupOptions: {
      // 确保对外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom'],
      output: {
        // 提供全局变量来使用 UMD 模块
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})