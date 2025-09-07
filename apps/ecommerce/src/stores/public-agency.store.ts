import { EMixContentStatus, IProfile } from '@mixcore/sdk-client';
import { withMixClient } from '@mixcore/sdk-client-ng';
import { withCRUD, withLocalStorage } from '@mixcore/signal';

import { signalStore } from '@ngrx/signals';

export interface IPublicAgency {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  address: string;
  status: EMixContentStatus;
  phone: string;
  email: string;
  members: { data: IAgencyMember[] };
  addresses: { data: IAgencyAddress[] };
  map?: string;
}

export interface IAgencyMember extends IProfile {
  status?: EMixContentStatus;
  created_date?: Date;
  created_by?: string;
}

interface Ward {
  name: string;
}

interface Province {
  name: string;
  wards: Ward[];
}

export interface IAgencyAddress {
  province: Province;
  ward?: Ward;

  status?: EMixContentStatus;
  created_date?: Date;
  created_by?: string;
}

export const publicAgencyStore = signalStore(
  { providedIn: 'root' },
  withCRUD({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) =>
          client.table.filterData<IPublicAgency>('mix_agency', query),
        getByIdFn: (id) =>
          client.table.getDataById<IPublicAgency>('mix_agency', <string>id),
      })),
  }),
  withLocalStorage('public-agency'),
);
