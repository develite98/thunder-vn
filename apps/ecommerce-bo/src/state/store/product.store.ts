import { createFromMixDb } from '@mixcore/sdk-client-ng';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { IProduct, IProductCategory } from '../../types';
import {
  productCategoryPageEvent,
  productDetailPageEvent,
  productDialogEvent,
  productPageEvent,
} from '../events/product.event';
const DB_NAME = 'mix_product';
const DB_CATEGORY_NAME = 'mix_ecom_product_category';

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IProduct>({
    apiFactory: createFromMixDb<IProduct>(DB_NAME),
    events: {
      searchDataOn: [
        productPageEvent.opened,
        productPageEvent.refreshed,
        productPageEvent.searched,
      ],
      createDataOn: [productDialogEvent.create],
      updateDataOn: [productDetailPageEvent.updated],
      deleteDataOn: [productDetailPageEvent.deleted],
      getDataByIdOn: [productDetailPageEvent.pageOpened],
    },
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
