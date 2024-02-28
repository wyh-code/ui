import { ReactNode } from "react";


class Schema {
  descriptor: any;
  fieldEntities: any;
  errorFields: any[] = [];
  constructor(fieldEntities: any, descriptor: any) {
    this.fieldEntities = fieldEntities;
    this.descriptor = descriptor;
  }

  getTipName (props: any) {
    return props.column.title;
  }

  async checker(record: any, row: any, idx?: number, keyName?: string, ) {
    console.log(record, idx, keyName, row)
    const errorInfo:any = {};
    for (const name in this.descriptor) {
      
      // 如果有具体属性名，则其他属性跳过校验
      if (keyName && name !== keyName) {
        continue;
      }

      const props = row[name].props;
      const tipName = this.getTipName(props);
      const value = record[name] || '';
      const { rules } = this.descriptor[name];
      const ruleKeys = Object.keys(rules); // [required,min,max,validator]
      console.log(rules, '==12', tipName)
      let errors: ReactNode[] = [];
      for (let i = 0; i < ruleKeys.length; i++) {
        const ruleKey = ruleKeys[i];
        if (ruleKey === 'required') {
          if (rules[ruleKey].value && !value) {
            errors.push(rules[ruleKey].message || `${tipName}是必填项`);
          }
        } else if (ruleKey === 'min') {
          if (value.length < rules[ruleKey].value) {
            errors.push(rules[ruleKey].message || `${tipName}最少是${rules[ruleKey].value}个字符!`);
          }
        } else if (ruleKey === 'max') {
          if (value.length > rules[ruleKey].value) {
            errors.push(rules[ruleKey].message  || `${tipName}最多是${rules[ruleKey].value}个字符!`);
          }
        } else if (ruleKey === 'validator') {
          if (rules.required?.value && !value) {
            // 若必填且无值，则不必重复校验
            continue;
          }
          const validator = rules[ruleKey].value;
          let validatorReault = validator(value, name, record, idx);

          // 如果自定义校验器返回的是promise则获取promise结果
          const { then } = validatorReault;
          if (then && typeof then === 'function') {
            validatorReault = await validatorReault.then((res: any) => res);
          }
          // 返回不为 true 则认为自己定义校验不通过，默认将返回信息作为错误提示
          if (validatorReault !== true) {
            const message = row[name].props.column?.message;
            errors.push(validatorReault || message || `${tipName}不符合自定义较验器的规则判断!`);
          }
        }
        // 非必填无值不报错
        if (!rules.required?.value && !value) {
          errors = [];
        }
      }

      if (errors.length > 0) {
        errorInfo[name] = errors;
        if (idx !== undefined) {
          console.log(this.errorFields, '--this.errorFields--')
          this.errorFields[idx] = errorInfo;
        } else {
          this.errorFields.push(errorInfo);
        }
      }
    }
  }

  validator(values: any, index?: number, name?: string) {
    return new Promise(async (resolve) => {
      // 校验收集
      const checker: any = [];
      try {
        values.forEach((record: any, idx: number) => {
          const row = this.fieldEntities[idx];
          // console.log(this.fieldEntities, '==this.fieldEntities=', row, idx)
          // 获取当前行的编辑状态
          const { __$isEdit } = row[Object.keys(row)[0]].props;

          // 如果有具体index，则只校验这一条数据
          if (index !== undefined) {
            if (idx === index) {
              checker.push(this.checker(record, row, idx, name, ));
            }
          } else {
            // 校验所有编辑行
            if (__$isEdit) {
              checker.push(this.checker(record, row, idx, name));
            }
          }
        });

        await Promise.all(checker);
        // console.log('---validator-result--', this.errorFields);

        const errors = this.errorFields;
        resolve({ errors, values });
      } catch (error) {
        console.log(error)
        resolve(null)
      }
    });
  }
}

export default Schema;
