import { inject } from '@angular/core';
import { setEntity, withCRUD } from '@mixcore/signal';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods } from '@ngrx/signals';
import { from } from 'rxjs';
import { RequestApi } from '../../api-service';
import {
  ECancellationType,
  ENotificationStatus,
  IGetPosRequest,
  IPosRequest,
} from '../../types';
import { requestPageEvent } from '../events/request-page.event';

export const RequestStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IPosRequest>({
    apiFactory: () => {
      const requestApi = inject(RequestApi);
      return {
        fetchFn: (query: IGetPosRequest) => requestApi.getRequests(query),
      };
    },
    events: {
      fetchDataOn: [requestPageEvent.opened],
    },
  }),
  withMethods((store, api = inject(RequestApi)) => ({
    approveRequest: (request: IPosRequest) => {
      const data = request.data;

      return from(
        api.approveVoidBill({
          itemType: request.type! as unknown as ECancellationType,
          cancellationType:
            data.cancellationType! as unknown as ECancellationType,
          cancellationReason: data.reason,
          branchId: data.branchId,
          orderId: data.orderId,
          itemId: data.itemId,
          requestedBy: request.createdBy,
          shiftId: data.shiftId,
          quantity: data.quantity,
          notificationId: request.id,
        }),
      ).pipe(
        tapResponse({
          next: () => {
            request.notificationStatus = ENotificationStatus.Proccessed;
            setEntity(store, request);
          },
          error: (err) => {
            console.error('Error approving request:', err);
          },
        }),
      );
    },
    rejectRequest: (request: IPosRequest) => {
      const data = request.data;

      return from(
        api.rejectVoidBill({
          itemType: request.type! as unknown as ECancellationType,
          cancellationType:
            data.cancellationType! as unknown as ECancellationType,
          cancellationReason: data.reason,
          branchId: data.branchId,
          orderId: data.orderId,
          itemId: data.itemId,
          requestedBy: request.createdBy,
          shiftId: data.shiftId,
          quantity: data.quantity,
          notificationId: request.id,
        }),
      ).pipe(
        tapResponse({
          next: () => {
            request.notificationStatus = ENotificationStatus.Proccessed;
            setEntity(store, request);
          },
          error: (err) => {
            console.error('Error approving request:', err);
          },
        }),
      );
    },
  })),
);
