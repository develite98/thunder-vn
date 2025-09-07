import { IBaseSearchEngine } from '@mixcore/sdk-client';

export interface IPage extends IBaseSearchEngine {
  id: number;
  title: string;
  description: string;
  status: string;
}

export interface IBlog extends IBaseSearchEngine {
  id: number;
  title: string;
  description: string;
  status: string;
  blog_type: EBlogType;
}

export enum EBlogType {
  POST = 'post',
  PIN = 'pin',
  INTERNAL = 'internal',
}
