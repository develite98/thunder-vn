import { IBranch } from './brand.type';

export enum EBmsBranchDeviceType {
  Root = 'Root',
  Cashier = 'Cashier',
  Handy = 'Handy',
  Printer = 'Printer',
}

export interface IBmsBranchDevice {
  code: string;
  displayName: string;
  priority: number;
  branchId: number;
  deviceType: EBmsBranchDeviceType;
  setting: IBranchDeviceSetting;
  isUsed: boolean;
  isDefault: boolean;
  masterId: number;
  isDisplay: boolean;
  isAvailable: boolean;
  createdAt: string;
  lastModified: string;
  id: number;
  parentId: number | null;
}

export enum EMMSBranchDeviceType {
  Root = 999999,
  Cashier = 2,
  Handy = 3,
  Printer = 4,
  KitchenPrinter = 1,
}

export const EMMSBranchDeviceTypeName: Record<EMMSBranchDeviceType, string> = {
  [EMMSBranchDeviceType.Root]: 'Root',
  [EMMSBranchDeviceType.Cashier]: 'Cashier',
  [EMMSBranchDeviceType.Handy]: 'Handy',
  [EMMSBranchDeviceType.Printer]: 'Printer',
  [EMMSBranchDeviceType.KitchenPrinter]: 'Kitchen printer',
};

export interface IMMSBranchDevice {
  storeId: number;
  typeId: EMMSBranchDeviceType;
  name: string;
  deviceIp: string;
  isDefault: boolean;
  code: string;
  isDisplay: boolean;
  isAvailable: boolean;
  createdAt: string;
  lastModified: string;
  masterDeviceId?: number | null;
  id: number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface IBranchDeviceSetting {
  [key: string]: string | number | boolean | null;
}

export const generateBranchMasterDevice = (branch: IBranch) => {
  return <IMMSBranchDevice>{
    storeId: branch.id,
    typeId: EMMSBranchDeviceType.Root,
    name: branch.name,
    deviceIp: '',
    isDefault: true,
    code: 'branch-master',
    isDisplay: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    id: 999,
  };
};
