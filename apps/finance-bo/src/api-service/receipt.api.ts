import { Injectable } from '@angular/core';
import {
  IActionCallback,
  IPaginationResultModel,
  TApiResponse,
} from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { GetReceiptPayload, IReceipt } from '../types';

@Injectable({ providedIn: 'root' })
export class ReceiptApi {
  public client = injectMixClient();

  public async getByOrderId(
    orderId: string,
    branchId?: number,
    saleDay?: Date,
    callback?: IActionCallback<IReceipt | null>,
  ) {
    try {
      const request = <GetReceiptPayload>{
        orderId,
        branchId: branchId,
        saleDay,
        paging: {
          pageIndex: 0,
          pageSize: 10,
        },
      };

      const result = await this.client.api.post<
        GetReceiptPayload,
        TApiResponse<IPaginationResultModel<IReceipt>>
      >(`/pos/api/receipt-management/filters`, request);

      const data = result.data;
      const receipt = data?.items?.[0] || null;
      callback?.success?.(receipt);

      return receipt;
    } catch (error) {
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }
}
