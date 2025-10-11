import { ECompareOperator } from '@mixcore/sdk-client';

export interface GridContextMenu<T> {
  label: string;
  icon: string;
  action: (item: T) => void;
  visible?: (item: T) => boolean;
  pinned?: boolean;
  iconClass?: string;
}

export interface ITableFilter {
  fieldName: string;
  label: string;
  type?: 'text' | 'number' | 'boolean';

  value?: string | number | boolean | Date | null;

  compareOperator?: ECompareOperator;
  allowdOperators?: ECompareOperator[];
}

export interface ITableSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ITableSortChange {
  sorts: ITableSort[];
}

export interface IColumnVisibility {
  [columnId: string]: boolean;
}

export interface IColumnVisibilityChange {
  columnVisibility: IColumnVisibility;
}

export const OPERATOR_DISPLAY: Record<string, string> = {
  [ECompareOperator.Like]: 'similar',
  [ECompareOperator.ILike]: 'similar*',
  [ECompareOperator.Equal]: '=',
  [ECompareOperator.NotEqual]: '≠',
  [ECompareOperator.LessThanOrEqual]: '≤',
  [ECompareOperator.LessThan]: '<',
  [ECompareOperator.GreaterThan]: '>',
  [ECompareOperator.GreaterThanOrEqual]: '≥',
  [ECompareOperator.Contain]: '⊂',
  [ECompareOperator.NotContain]: '⊄',
  [ECompareOperator.InRange]: '<=>',
};
