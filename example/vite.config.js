import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname), // 指定项目根目录为 example 目录
  resolve: {
    alias: {
      // 配置别名，直接使用源代码而非构建产物
      '@ostore/table': path.resolve(__dirname, '../src')
    },
  },
  // 其他配置...
})