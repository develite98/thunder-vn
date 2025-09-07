import { Injectable } from '@angular/core';
import {
  convertPagingDataKeyDeep,
  IActionCallback,
  IPaginationResultModel,
  MixQuery,
  TApiResponse,
} from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { ITicket } from '@mixcore/shared-domain';

@Injectable({ providedIn: 'root' })
export class TicketApiService {
  public client = injectMixClient();

  public async getTickets(
    query: MixQuery,
    callback?: IActionCallback<IPaginationResultModel<ITicket>>,
  ) {
    try {
      const response = await this.client.api.get<
        MixQuery,
        TApiResponse<IPaginationResultModel<ITicket>>
      >('/one/api/v2/rest/ticket/get-list', {
        params: query,
      });

      const data = convertPagingDataKeyDeep<IPaginationResultModel<ITicket>>(
        response.data,
      );
      callback?.success?.(data);
      return data;
    } catch (error) {
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }

  public async updateTicket(
    ticket: Partial<ITicket>,
    callback?: IActionCallback<ITicket>,
  ) {
    try {
      const response = await this.client.api.post<
        MixQuery,
        TApiResponse<ITicket>
      >('/one/api/v2/rest/ticket/update', ticket);
      const data = response.data;
      callback?.success?.(data);
      return data;
    } catch (error) {
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }

  public async getTicketById(id: number, callback?: IActionCallback<ITicket>) {
    try {
      const response = await this.client.api.get<
        MixQuery,
        TApiResponse<ITicket>
      >(`/one/api/v2/rest/ticket/detail/${id}`);
      const data = response.data;
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
