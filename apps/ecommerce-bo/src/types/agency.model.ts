import { EMixContentStatus, IUser } from '@mixcore/sdk-client';

export interface IAgency {
  id: number;
  owner_name: string;
  owner: string;
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  long: number;
  status: EMixContentStatus;
  members: { data: IAgencyMember[] };
  addresses: { data: IAgencyAddress[] };
}

export interface IAgencyMember extends IUser {
  status?: EMixContentStatus;
  fullName?: string;
  created_date?: Date;
  created_by?: string;
  agency_id?: number;
}

interface Ward {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
  wards: Ward[];
}

interface Province {
  code: number;
  name: string;
  districts: District[];
  wards?: Ward[];
}

export interface IAgencyAddress {
  id: string;

  province: Province;
  district?: District;
  ward?: Ward;

  status?: EMixContentStatus;
  created_date?: Date;
  updated_date?: Date;
}

export interface ISubscriber {
  id: number;
  email: string;
  phone: string;
  full_name: string;
  status: string;
  created_date_time: string;
  updated_date_time?: string;
}
