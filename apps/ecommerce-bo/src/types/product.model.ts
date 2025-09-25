import { EMixContentStatus } from '@mixcore/sdk-client';

export interface IProduct {
  id: number;
  created_by: string;
  title: string;
  thumbnail: string;
  price: number;
  description: string;
  short_description: string;
  sub_title: string;
  media?: {
    mediaList: string[];
  };
  status: EMixContentStatus;
  seo_url?: string;
  seo_title?: string;
  seo_description?: string;
  seo_meta_keyword?: string;
}

export interface IProductCategory {
  id: number;
  title: string;
  description: string;
  status: EMixContentStatus;
  product_slugs?: string;
  priority: number;
}

export interface ICategoryProduct {
  product_id: number;
  category_id: number;
  priority: number;
  id: number;
}
