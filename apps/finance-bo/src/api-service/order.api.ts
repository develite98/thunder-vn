import { Injectable } from '@angular/core';
import { IActionCallback } from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { IOrder } from '../types';

@Injectable({ providedIn: 'root' })
export class OrderApi {
  public client = injectMixClient();

  public async getOrderById(id: string, callback?: IActionCallback<IOrder>) {
    try {
      const result = await this.client.api.get<IOrder>(
        `/pos/api/order-management/get-order/${id}`,
      );

      const data = result.data;
      callback?.success?.(data);

      return data;
    } catch (error) {
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }
}
