import { ReactNode } from "react";

export type EditRow = (item: any) => boolean;

export interface IRules {
  min?: number; // 最小长度
  max?: number; // 最大长度
  required?: boolean; // 是否必填
}

export type TRulesKey = keyof IRules;
export type IRuleProps = {
  [P in TRulesKey]?: { 
    [K in P]: IRules[K];
  } & { message?: ReactNode }
}[TRulesKey];

export type TValidatorResult = boolean | ReactNode | Promise<boolean|ReactNode>
export interface IColumn extends IRules {
  dataIndex: string;
  title?: ReactNode;
  width?: number | string;
  // 校验失败提示消息
  message?: ReactNode;
  // 校验器是否防抖处理
  debounce?: number; 
  // 校验器
  validator?: (value: any, name: string, record: any, index: number) => TValidatorResult; // 校验器
  // 校验规则
  rules?: IRuleProps[]; // rules存在时，column中继承的IRules属性会失效
  // 默认渲染函数
  cell?: (value: string|any[], index: number, record: any) => ReactNode;
  // 编辑态渲染函数
  editCell?: (value: string|undefined|any[], index: number, record: any) => ReactNode;
  // 其他扩展属性
}

export interface ITableProps {
  // 基础属性
  columns: IColumn[]; // 表头
  dataSource: any[]; // 数据源
  field?: ClassUseField; // 可编辑时需传入，覆盖默认field
  editRow?: EditRow;  // 返回可以编辑的行
}

export interface IRowProps {
  columns: IColumn[];
  editRow: EditRow | undefined;
  record: any;
  index: number;
  field: ClassUseField;
}

export interface ICellProps {
  column: IColumn;
  index: number;
  editRow: EditRow | undefined;
  record: any;
  field: ClassUseField;
}

export interface ClassUseField {
  resetFieldValues: () => void;
  setFieldValue: (index:number, name: string, value: any) => void;
  setFieldValues: (index:number, values:any) => void;
  getFieldValue: (index:number, name: string) => any;
  getFieldValues: (index?:number) => any;

  setFieldError: (index:number, name: string, value: any) => void;
  setFieldErrors: (index:number, errors: any) => void;
  getFieldError: (index:number, name: string) => any;
  getFieldErrors: (index?: number) => any;
 
  validator: (index?:number, name?: string) => any;
  registerField: (index: number, config: IFieldEntities) => any;
}

export interface IFieldEntities {
  props: any;
  forceReRender?: () => any;
}

export interface TableWithStatics {
  useField: () => ClassUseField;
}

export interface IError {
  [key: string]: ReactNode[]
}

export type TTableStatic = React.ForwardRefExoticComponent<ITableProps & React.RefAttributes<HTMLDivElement>> & TableWithStatics;
