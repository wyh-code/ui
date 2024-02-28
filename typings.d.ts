import { TTableStatic } from './src/index';

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.d.ts' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.ts' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '@ostore/ui' {
  export const Table: TTableStatic;
}
