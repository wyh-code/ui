import React, { useEffect } from 'react';
import Row from './Row';
import { useField } from './useField';
import { ITableProps, TTableStatic } from './type.d';
import { classNames } from '../../utils';
import './index.less';

const TableWithRef = React.forwardRef<HTMLDivElement, ITableProps>((props, ref) => {
  const {
    columns,
    dataSource,
    field=useField(),
    editRow
  } = props;

  useEffect(() => {
    // 初始化编辑数据
    field.resetFieldValues();
    dataSource.forEach((record, index) => {
      field.setFieldValues(index, {...record})
    })
  }, [JSON.stringify(dataSource)])

  return (
    <div ref={ref} className={classNames('table')}>
      <table>
        <thead>
          <tr>
            {columns.map(column => <th key={column.dataIndex} style={{width: column.width || 'auto' }}>{column.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((record, index) => (
            <Row key={index} index={index} editRow={editRow} record={record} columns={columns} field={field} />
          ))}
        </tbody>
      </table>
    </div>
  )
});

// 添加静态属性并进行类型断言
const Table = TableWithRef as TTableStatic;
Table.useField = useField;

export default Table;
