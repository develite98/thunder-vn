export interface IBmsBranch {
  id: number;
  currencyId: number;
  code: string;
  sapCode: string;
  name: string;
  shortName: string;
  lat: string;
  firstAddressLine: string;
  secondAddressLine: string;
  website: string;
  phone: string;
  cityId: number;
  brandId: number;
  openDate: string;
  closeDate: string;
  isDisplay: boolean;
  isAvailable: boolean;
  createdAt: string;
  lastModified: string;
  originId?: number; // Optional field for origin ID
}
