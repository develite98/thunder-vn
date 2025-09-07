import { IPaginationRequestModel } from '@mixcore/sdk-client';
import { ECancellationType } from './order.type';

export enum EOrderCancellationStatus {
  PendingApproval = 'PendingApproval',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface EReason {
  originStoreId: number;
  branchId: number;
  originId: number;
  originCode: string;
  originTemplateId: number;
  displayName: string;
  shortName: string;
  details?: string;
}

export interface ICancelReceiptPayload {
  branchId: number;
  originStoreId?: number;
  orderId: string;
  cancellationReason?: EReason;
  reason?: EReason;
  cancellationType?: ECancellationType;
  tableId?: number;
  shiftId?: number;
  itemId?: string;
  name?: string;
  requestedBy?: string;
  userName?: string;
  quantity?: number;
  notificationId?: number;
  deviceId?: number;
}

export interface IReceipt {
  id: string;
  rePrintNo: number;
  priority: number;
  status: string;
  shiftId: number;
  isDeleted: boolean;
  branchId: number;
  orderId: string;
  totalValue: number;
  totalGrossValue: number;
  totalTaxValue: number;
  totalFeeValue: number;
  totalItemDiscountValue: number;
  totalBillDiscountValue: number;
  totalDiscountValue: number;
  cancellationReason?: EReason;
  cancellationStatus?: EOrderCancellationStatus;
  orderNo: number;
  saleDate: string;
  deviceId: number;
  checkNo: number;
  createdDateTime?: string;
  receiptStatus?: string;
  dateTime?: string;
  createdBy: string;
  modifiedBy: string;
  isDelete: boolean;
  modifiedEntities: Array<unknown>;
}

export interface GetReceiptPayload {
  branchId?: number;
  orderNo?: number | null;
  orderId?: string | null;
  shiftId?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
  paging?: Partial<IPaginationRequestModel>;
  deviceId?: number | null;
  saleDate?: string;
}
