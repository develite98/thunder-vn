import { FormlyFieldConfig } from '@ngx-formly/core';

export interface IFormRecommend {
  label: string;
  value: string | number | Date;
}

export type IPropsConfig = FormlyFieldConfig['props'] & {
  recommends?: IFormRecommend[];
  fileUploadFn?: (file: File) => Promise<string>;
  base64FileUploadFn?: (content: string) => Promise<string>;
  aspectRatios?: { label: string; value: number }[];
  groupLabel?: string;
};
export interface IFormConfig extends FormlyFieldConfig {
  id?: string;
  props?: IPropsConfig;
}
