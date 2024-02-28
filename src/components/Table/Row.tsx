import React from 'react';
import Cell from './Cell';
import { IColumn, IRowProps } from './type.d';
import './index.less';

const Row = React.forwardRef<HTMLDivElement, IRowProps>((props, ref) => {
  const {
    columns,
    record,
    field,
    index,
    editRow
  } = props;

  return (
    <tr>
      {columns.map((column: IColumn) => (
        <Cell
          key={`${column.dataIndex}-${index}`}
          column={column}
          record={record}
          index={index}
          editRow={editRow}
          field={field}
        />
      ))}
    </tr>
  )
});

export default Row;
