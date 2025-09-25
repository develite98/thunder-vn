import { ECompareOperator, IMixFilter } from '@mixcore/sdk-client';

export interface IFilterConfiguration {
  fieldName: string;
  label: string;
  type?: 'text' | 'number' | 'boolean' | 'date';
  allowdOperators?: ECompareOperator[];
  allowedValues?: { value: string | boolean | Date | number; label: string }[];
}

export type IFilterValue = IMixFilter;
