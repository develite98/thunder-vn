export interface IBrand {
  name: string;
  isActive: boolean;
  branches: IBranch[];
  createdDateTime: string;

  createdBy: string;
  modifiedBy: string;
  priority: number;
  status: string;
  isDeleted: boolean;
  id: number;
  shortName: string;

  currencyId: number;
  code: string;
  sapCode: string;
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
}

export interface IBranch {
  name: string;
  phoneNumber?: string;
  code: string;
  configurations?: IConfigurations;
  createdDateTime: string;
  lastModified: string;
  createdBy?: string;
  modifiedBy?: string;
  priority: number;
  status: string;
  isDeleted: boolean;
  id: number;
  brandName?: string;
}

export interface IConfigurations {
  receipt_printer?: string;
  activeServiceFee?: boolean;
  kitchenMode?: string;
  kitchen_printers?: IKitchenPrinters;
  currentCheckNo?: number;
  printUrl?: string;
  timezone?: number;
  currency?: string;
  payments?: IPayments;
}

export interface IKitchenPrinters {
  default: IDefault;
}

export interface IDefault {
  DrinkPrinter: string;
  PizzaPrinter: string;
  RamenDishupPrinter?: string;
  RamenCheckerPrinter?: string;
}

export interface IPayments {
  payoo: IPayoo;
}

export interface IPayoo {
  storeCode: string;
  storeName: string;
}
