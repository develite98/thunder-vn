import { Injectable } from '@angular/core';
import {
  IActionCallback,
  IPaginationResultModel,
  MixQuery,
  TApiResponse,
} from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import {
  CancelReceiptPayload,
  IGetPosRequest,
  IGetRequestPayload,
  IPosRequest,
} from '../types';

@Injectable({ providedIn: 'root' })
export class RequestApi {
  public client = injectMixClient();

  public async getRequests(
    query: IGetPosRequest,
    callback?: IActionCallback<IPaginationResultModel<IPosRequest>>,
  ) {
    try {
      const request = {
        ...query,
        paging: {
          pageSize: query.pageSize || 50,
          pageIndex: query.pageIndex || 0,
          sortByColumns: [
            {
              fieldName: 'createdDateTime',
              direction: 'Desc',
            },
          ],
        },
      } as IGetRequestPayload;

      const result = await this.client.api.post<
        MixQuery,
        TApiResponse<IPaginationResultModel<IPosRequest>>
      >('/pos/api/notification/filter', request);

      const data = result.data;
      if (callback) {
        callback?.success?.(data);
      }

      return data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }

  public async approveVoidBill(
    request: CancelReceiptPayload,
    callback?: IActionCallback<unknown>,
  ) {
    try {
      const result = await this.client.api.post<
        CancelReceiptPayload,
        TApiResponse<unknown>
      >('/pos/api/receipt-management/cancellation/cancel', request);

      const data = result?.data;
      callback?.success?.(data);
      return result;
    } catch (error) {
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }

  public async rejectVoidBill(
    request: CancelReceiptPayload,
    callback?: IActionCallback<unknown>,
  ) {
    try {
      const result = await this.client.api.post<
        CancelReceiptPayload,
        TApiResponse<unknown>
      >('/pos/api/receipt-management/cancellation/reject', request);

      const data = result?.data;
      callback?.success?.(data);
      return result;
    } catch (error) {
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }
}
