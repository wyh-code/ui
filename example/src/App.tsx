import React, { useState } from 'react';
import { Table, IColumn, TValidatorResult } from '@ostore/ui';

function App() {
  const [dataSource, setDataSource] = useState([
    {
      name: 'jack',
      age: 18
    },
    {
      name: 'tom',
      age: 19
    },
    {
      name: 'lili',
      age: 20
    },
  ]);

  const tableChange = (value: any, key: string, index: number, record: any) => {
    record[key] = value;
    setDataSource([...dataSource]);
  }

  const handler = (record: any) => {
    record.isEdit = !record.isEdit;
    setDataSource([...dataSource]);
  }

  const remove = (record: any) => {
   const newData = dataSource.filter(item => item !== record);
   setDataSource(newData);
  }

  const columns:IColumn[] = [
    {
      title: '姓名',
      width: '25%',
      dataIndex: 'name',
      min: 2,
      max: 10,
      required: true,
      message: '姓名长度为2到10个字符',
      cell: (value) => value,
      editCell: (value, index, record) => (
        <input value={value} onChange={(e) => tableChange(e.target.value, 'name', index, record)} />
      )
    },
    {
      title: '年龄',
      width: '25%',
      dataIndex: 'age',
      // min: 1,
      // max: 3,
      // required: true,
      validator: async (value, name, index, record) => {
        // const p: TValidatorResult = 
        // const result = await p;
        // console.log(result, '==result==')
        return new Promise(resolve => {
          resolve(true);
        });
      },
      cell: (value) => value,
      editCell: (value, index, record) => (
        <input value={value} onChange={(e) => tableChange(e.target.value, 'age', index, record)} />
      )
    },
    {
      title: '地址',
      width: '25%',
      dataIndex: 'adress',
      rules: [{min: 10, message: '最小要输入10个字符'}, { max: 20, message: '最多不能超过20个字符' }],
      cell: (value) => value,
      editCell: (value, index, record) => (
        <input value={value} onChange={(e) => tableChange(e.target.value, 'adress', index, record)} />
      )
    },
    {
      title: '操作',
      width: '25%',
      dataIndex: 'handler',
      cell: (value, index, record) => (
        <>
          <button onClick={() => handler(record)}>{record.isEdit ? '保存' : '编辑'}</button>
          <button onClick={() => remove(record)}>删除</button>
        </>
      ),
    },
  ]

  const field = Table.useField();


  return (
    <div style={{ margin: 20 }}>
      <Table 
        field={field}
        dataSource={dataSource}
        columns={columns}
        editRow={record => record.isEdit}
      />
    </div>
  )
}

export default App
