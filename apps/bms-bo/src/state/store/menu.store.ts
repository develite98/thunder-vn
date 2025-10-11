import { ECompareOperator } from '@mixcore/sdk-client';
import { withCRUD } from '@mixcore/signal';
import { signalStore } from '@ngrx/signals';
import { createFromTmsDb } from '../../helpers';

export interface IMenu {
  name: string;
  storeId: number;
  storeName: string;
  saleChannelId: number;
  saleChannelName: string;
  saleTypeId: number;
  saleTypeName: string;
  brandId: number;
  brandName: string;
  cityId: number;
  cityName: string;
  regionId: number;
  regionName: string;
  countryId: number;
  countryName: string;
  isDisplay: boolean;
  isAvailable: boolean;
  createdAt: string;
  lastModified: string;
  id: number;
}

export interface IMenuItem {
  name: string;
  displayName: string;
  menuId: number;
  itemTemplateId: number;
  price: number;
  currencyId: number;
  currencyName: string;
  currencySymbol: string;
  currencyShortName: string;
  currencySymbolPosition: string;
  itemTemplateTypeId: number;
  itemTemplateCode: string;
  masterCategoryId: number;
  masterCategoryParentId: number;
  isDisplay: boolean;
  isAvailable: boolean;
  createdAt: string;
  lastModified: string;
  id: number;
}

export const MenuStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IMenu>({
    apiFactory: createFromTmsDb('menu-materialized-view'),
  }),
);

export const MenuItemStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IMenuItem>({
    apiFactory: createFromTmsDb('item-materialized-view'),
    filterConfig: [
      {
        fieldName: 'displayName',
        allowdOperators: [ECompareOperator.Equal, ECompareOperator.Like],
        label: 'Store name',
      },
    ],
  }),
);
