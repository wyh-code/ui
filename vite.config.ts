import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // 开发配置
      // plugins: [react()],
      plugins: [reactRefresh()],
      root: 'example',
      resolve: {
        alias: {
          '@ostore/ui': resolve(__dirname, 'src/index.ts'), // 添加别名
        },
      },
    };
  } else {
    // 打包配置
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'ostoreComponents',
          fileName: (format) => `ostoreComponents.${format}.js`
        },
        rollupOptions: {
          // 确保外部化处理那些你不想打包进库的依赖
          external: ['react', 'react-dom'],
          output: {
            // 为了兼容性，确保 UMD 或 CommonJS 的构建将 React 定义为外部依赖
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
    };
  }
});