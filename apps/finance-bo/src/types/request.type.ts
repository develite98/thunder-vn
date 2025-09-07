import { MixQuery, PaginationModel } from '@mixcore/sdk-client';
import { ICancelReceiptPayload } from './receipt.type';

export interface IPosRequest {
  branchId: number;
  originTemplate: string;
  data: ICancelReceiptPayload;
  type: string;
  notificationStatus: ENotificationStatus;
  createdDateTime: string;
  lastModified: Date;
  createdBy: string;
  priority: number;
  status: string;
  isDeleted: boolean;
  id: number;
}

export interface IGetRequestPayload {
  branchId?: number;
  statuses?: string[];
  types?: string[];
  paging: PaginationModel;
}

export enum ENotificationType {
  CancelItemOnTable = 'CancelItemOnTable',
  CancelOrder = 'CancelOrder',
  CancelItem = 'CancelItem',
  CancelOrderOnTable = 'CancelOrderOnTable',
  ChangeOrderStatus = 'ChangeOrderStatus',
  CancelPaidOrder = 'CancelPaidOrder',
}

export enum ENotificationStatus {
  Proccessed = 'Proccessed',
  New = 'New',
}

export class IGetPosRequest extends MixQuery {
  branchId?: number;
  statuses?: string[];
  types?: string[];

  constructor(data?: Partial<IGetRequestPayload>) {
    super();

    if (data) {
      this.branchId = data.branchId;
      this.statuses = data.statuses;
      this.types = data.types;
    }
  }
}
