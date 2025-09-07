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

export const MenuStore = signalStore(
  {
    providedIn: 'root',
  },
  withCRUD<IMenu>({
    apiFactory: createFromTmsDb('menu-materialized-view'),
  }),
);
