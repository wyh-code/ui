import { ReactNode } from "react";

export interface IButtonProps {
  children?: ReactNode;
  onClick?: (e: EventTarget) => void;
  type: 'default' | 'primary' | 'success' | 'error' | 'warning';
}
