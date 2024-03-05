## 目录结构
```
my-react-library/
├─ dist/         // 打包后的输出目录
├─ example/      // 使用示例代码
│  ├─ src/
│  │  └─ App.tsx
│  └─ index.html
├─ src/          // 组件源代码
│  ├─ components/
│  │  ├─ Button/
│  │  │  ├─ Button.tsx
│  │  │  ├─ index.ts
│  │  │  └─ Button.css
│  │  └─ ...
│  ├─ index.ts  // 组件库入口，用于导出所有组件
│  └─ types/    // 全局类型声明
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```

## 开始

### 安装依赖
```sh
npm install
```

### 本地启动
```sh
npm run dev
```

### 打包构建
```sh
npm run build
```