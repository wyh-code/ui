import React from 'react';
import { debounce } from '@ostore/utils';
import { ICellProps } from './type.d';
import { classNames } from '../../utils';
import './index.less';

const Row = React.forwardRef<HTMLDivElement, ICellProps>((props, ref) => {
  const {
    index,
    column,
    record,
    field,
    editRow,
  } = props;

  const [, forceUpdate] = React.useState({});
  const forceReRender = () => {
    // 校验结束后调用此方法可以让组件刷新
    forceUpdate({});
  };

  // 获取展示结点
  const ElementNode = column.cell ? column.cell(record[column.dataIndex], index, record) : record[column.dataIndex];
  // 编辑模式下，有些结点不需要编辑没有 editCell，默认展示 ElementNode
  const EditElementNode = column.editCell ? column.editCell(record[column.dataIndex], index, record) : ElementNode;
  // 是否编辑态
  const isEdit = editRow && editRow(record);
  let currentElementNode = isEdit ? EditElementNode : ElementNode;

  // 属性劫持
  const name = column.dataIndex;
  const getControlled = (childProps: any) => {
    const { setFieldValue } = field;
    return {
      ...childProps,
      onChange: (value: any, ...args: any) => {
        // 修改formStore中值，用于校验器检验
        setFieldValue(index, name, (value.target?.value || value)); // 原生dom中value为事件对象
        if (column.debounce) {
          debounce(field.validator(index, name), column.debounce);
        } else {
          field.validator(index, name);
        }

        // 执行原函数
        childProps.onChange && childProps.onChange(value, ...args);
      },
    };
  };

  const elementProps = currentElementNode?.props || {};
  const CloneElement = currentElementNode?.type ?
    React.cloneElement(currentElementNode, getControlled(elementProps)) :
    currentElementNode;

  // 注册节点
  const config = {
    forceReRender,
    props: {
      name,
      column,
      elementProps: elementProps || {},
      __$isEdit: isEdit,
    },
  };
  field.registerField(index, config);
  const errorMessage = field.getFieldError(index, name);
  return (
    <td className={classNames(isEdit ? ['table-cell-wraper', 'table-cell-message-wraper'] : 'table-cell-wraper')}>
      {CloneElement}
      {isEdit && errorMessage && (
        <span className={isEdit ? classNames('table-cell-message') : ''}>{errorMessage[0]}</span>
      )}
    </td>
  )
});

export default Row;
