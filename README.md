

## 目录结构
```
my-react-library/
├─ src/
│  ├─ components/
│  │  ├─ Button/
│  │  │  ├─ Button.tsx
│  │  │  ├─ index.ts
│  │  │  └─ Button.css
│  │  └─ ...
│  ├─ index.ts  // 组件库入口，用于导出所有组件
│  └─ types/    // 可选，如果有全局类型声明
├─ example/
│  ├─ src/
│  │  └─ App.tsx
│  └─ index.html
├─ dist/         // 打包后的输出目录
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```