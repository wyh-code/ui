import React from 'react';
import { ClassUseField, IFieldEntities, IError } from './type.d';
import Schema from './async-validator';

class FormStore {
  store: any;
  fieldEntities: { [key: string]: IFieldEntities }[] = [];
  fieldErrors: IError[] = [];

  constructor() {
    this.store = [];
    this.fieldEntities = [];
  }

  registerField = (index: number, config: IFieldEntities) => {
    this.fieldEntities[index] = this.fieldEntities[index] || {};
    this.fieldEntities[index][config.props.name] = config;
  };

  resetFieldValues = () => {
    this.store = []
  };

  setFieldValues = (index: number, newStore: any) => {
    if (index === undefined) return;
    // 缓存当前编辑数据
    this.store[index] = newStore;
  };
  setFieldValue = (index: number, name: string, value: any) => {
    if (index === undefined) return;
    if (name === undefined) return;
    console.log(this.store, index, name)
    this.store[index][name] = value;
  };
  getFieldValue = (index: any, name: string) => {
    if (index === undefined) return;
    // 获取 store中的某个属性名称的值
    return this.store[index][name];
  };
  getFieldValues = (index?: any) => {
    return index === undefined ? this.store : this.store[index];
  };

  setFieldError = (index: number, name: string, error: any) => {
    if (index === undefined) return;
    if (name === undefined) return;
    this.fieldErrors[index][name] = error;
  };
  setFieldErrors = (index: number, newErrors: any) => {
    if (index === undefined) return;
    this.fieldErrors[index] = newErrors;
  };
  getFieldErrors = (index?: number) => {
    return index !== undefined ? this.fieldErrors[index] : this.fieldErrors;
  };
  getFieldError = (index: number, name: string) => {
    if (index === undefined) return;
    const errors = this.fieldErrors[index] || {};
    return name ? errors[name] : errors;
  };

  defaultRulesKeys = ['min', 'max', 'required', 'validator']

  getRules(entity: IFieldEntities) {
    const column = entity.props.column;
    const rules = column.rules || [];
    // 提取columns上的校验规则
    const defaultKeys = this.defaultRulesKeys;
    const ruleKeys = Object.keys(rules.reduce((obj: any, rule: any) => ({ ...obj, ...rule }), {}));
    for(let key in column){
      // 默认校验字段包含，且rules中没有定义的校验字段，需要添加
      if(defaultKeys.includes(key) && !ruleKeys.includes(key)){
        rules.push({
          [key]: column[key],
          message: column.message,
        })
      }
    };

    return rules;
  }

  validator = (index?:number, name?: string) => {
    let rowInfo = this.fieldEntities[0];
    // 若用户field传递出错，此处rowInfo可能获取不到，要做阻断
    if(!rowInfo){
      console.error('请检查 field 参数传递是否正确');
      return;
    }
    // 组装校验器描述
    const keys = Object.keys(rowInfo);
    const descriptor = keys.reduce((descriptor: any, key) => {
      const entity = rowInfo[key];
      const column = entity.props.column;
      // [{required:true},{min:3, message: ''},{max:6}]
      const rules = this.getRules(entity);

      if (rules.length > 0) {
        // {required:{ value: true },min:{ value: 3 },max:{ value: 6 }}
        const config = rules.reduce((memo: any, rule: any) => {
          const ruleConfig:any = {};
          for(let key in rule){
            if(this.defaultRulesKeys.includes(key)){
              ruleConfig[key] = {
                value: rule[key],
                message: rule.message || column.message
              };
            }
          }
          memo = { 
            ...memo, 
            ...ruleConfig 
          };
          return memo;
        }, {});
     
        descriptor[column.dataIndex] = {
          title: column.title,
          name: column.dataIndex,
          rules: config,
        };
      }
      return descriptor;
    }, {});
    // const columns = keys.map((key) => rowInfo[key].props.column);
    const values = this.getFieldValues();
    return new Schema(this.fieldEntities, descriptor).validator(values, index, name).then((result: any) => {
      this.fieldErrors = result.errors;
      // 校验为异步进行，需要再次手动刷新组件
      this.fieldEntities.forEach((row) => {
        Object.keys(row).forEach((name) => {
          const { forceReRender } = row[name];
          // 直接更新，react会去做domDiff
          forceReRender && forceReRender();
        });
      });

      return result;
    })
  }

  getForm(): ClassUseField {
    return {
      resetFieldValues: this.resetFieldValues,
      setFieldValue: this.setFieldValue,
      setFieldValues: this.setFieldValues,
      getFieldValue: this.getFieldValue,
      getFieldValues: this.getFieldValues,

      setFieldError: this.setFieldError,
      setFieldErrors: this.setFieldErrors,
      getFieldError: this.getFieldError,
      getFieldErrors: this.getFieldErrors,

      validator: this.validator,
      registerField: this.registerField,
    };
  }
}


export const useField = () => {
  const formRef = React.useRef<undefined | ClassUseField>();

  // 确保不会因为页面刷新生成新的实例
  if (!formRef.current) {
    const formStore = new FormStore();
    const formInstance = formStore.getForm();
    formRef.current = formInstance;
  }

  return formRef.current;
};