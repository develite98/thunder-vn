import { ECompareOperator } from '@mixcore/sdk-client';

export interface GridContextMenu<T> {
  label: string;
  icon: string;
  action: (item: T) => void;
  pinned?: boolean;
  iconClass?: string;
}

export interface ITableFilter {
  fieldName: string;
  label: string;
  value?: string | number | boolean;
  type?: 'text' | 'number' | 'boolean';
  options?: ITableFilterValue[];
  compareOperator?: ECompareOperator[];
}

export interface ITableFilterValue {
  fieldName: string;
  value: string | number | boolean | Date | null;
  label?: string;
  compareOperator: ECompareOperator;
}

export interface ITableSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ITableSortChange {
  sorts: ITableSort[];
}
