import { ECompareOperator } from '@mixcore/sdk-client';
import { createFromMixDb } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { ICategoryProduct, IProduct, IProductCategory } from '../../types';
import { productCategoryPageEvent } from '../events/product.event';

const DB_NAME = 'mix_product';
const DB_CATEGORY_NAME = 'mix_ecom_product_category';
const DB_PRODUCT_CATEGORY = 'category_product';

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IProduct>({
    apiFactory: createFromMixDb<IProduct>(DB_NAME),
    filterConfig: [
      {
        fieldName: 'title',
        label: 'Tên sản phẩm',
        type: 'text',
        allowdOperators: [ECompareOperator.Equal, ECompareOperator.Like],
      },
    ],
  }),
);

export const ProductCategoryStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IProductCategory>({
    apiFactory: createFromMixDb<IProductCategory>(DB_CATEGORY_NAME),
    events: {
      fetchDataOn: [
        productCategoryPageEvent.opened,
        productCategoryPageEvent.refreshed,
      ],
      createDataOn: [
        productCategoryPageEvent.create,
        productCategoryPageEvent.create,
      ],
      updateDataOn: [productCategoryPageEvent.updated],
      deleteDataOn: [productCategoryPageEvent.deleted],
    },
  }),
);

export const CategoryProductRelationStore = signalStore(
  { providedIn: 'root' },
  withCRUD<ICategoryProduct>({
    apiFactory: createFromMixDb<ICategoryProduct>(DB_PRODUCT_CATEGORY),
  }),
);
