import React from 'react';
import { classNames } from 'src/utils';
import { IButtonProps } from './type.d';
import './index.less';

export default (props: IButtonProps) => {

  const { children } = props;


  return <button  className={classNames('button')}>{children}</button>
}