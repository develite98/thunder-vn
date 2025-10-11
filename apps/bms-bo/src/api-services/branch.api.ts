import { Injectable } from '@angular/core';
import {
  IActionCallback,
  IPaginationResultModel,
  MixQuery,
  TApiResponse,
} from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import {
  IBmsBranch,
  IBranch,
  IBranchMemberRelation,
  IMMSBranchDevice,
} from '@mixcore/shared-domain';

@Injectable({ providedIn: 'root' })
export class BranchApi {
  public client = injectMixClient();

  public async getBranchs(
    query: MixQuery,
    callback?: IActionCallback<IPaginationResultModel<IBranch>>,
  ) {
    try {
      const result = await this.client.api.post<
        MixQuery,
        TApiResponse<IPaginationResultModel<IBranch>>
      >('/tms/api/v2/rest/store-store/filter', query);

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

  public async getBranchById(id: number, callback?: IActionCallback<IBranch>) {
    try {
      const result = await this.client.api.post<
        MixQuery,
        TApiResponse<IPaginationResultModel<IBranch>>
      >(
        '/tms/api/v2/rest/store-store/filter',
        new MixQuery().default(1).equal('Id', id.toString()),
      );

      const data = result.data?.items?.[0];
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

  public async getBmsBranchById(
    id: number,
    callback?: IActionCallback<IBmsBranch>,
  ) {
    try {
      const result = await this.client.api.post<
        MixQuery,
        TApiResponse<IPaginationResultModel<IBmsBranch>>
      >(
        '/tms/api/v2/rest/bms-branch/filter',
        new MixQuery().default(1).equal('OriginId', id.toString()),
      );

      const data = result.data?.items?.[0];
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

  public async updateBmsBranch(
    value: IBmsBranch,
    callback?: IActionCallback<IBmsBranch>,
  ) {
    try {
      const result = await this.client.api.put<
        MixQuery,
        TApiResponse<IPaginationResultModel<IBmsBranch>>
      >(`/tms/api/v2/rest/bms-branch/${value.id}`, value);

      const data = result.data?.items?.[0];
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

  public async createBmsBranchByOriginId(
    value: Partial<IBmsBranch>,
    callback?: IActionCallback<IBmsBranch>,
  ) {
    try {
      const result = await this.client.api.post<
        MixQuery,
        TApiResponse<IBmsBranch>
      >('/tms/api/v2/rest/bms-branch', value);

      const data = result.data;

      callback?.success?.(data);
      return data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }

  public async getDevices(
    query: MixQuery,
    callback?: IActionCallback<IPaginationResultModel<IMMSBranchDevice>>,
  ) {
    try {
      const result = await this.client.api.post<
        MixQuery,
        TApiResponse<IPaginationResultModel<IMMSBranchDevice>>
      >('/tms/api/v2/rest/device-device/filter', query);

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

  public async createDevice(
    value: Partial<IMMSBranchDevice>,
    callback?: IActionCallback<IMMSBranchDevice>,
  ) {
    try {
      const result = await this.client.api.post<
        Partial<IMMSBranchDevice>,
        TApiResponse<IMMSBranchDevice>
      >('/tms/api/v2/rest/device-device', value);

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

  public async updateDevice(
    value: IMMSBranchDevice,
    callback?: IActionCallback<IMMSBranchDevice>,
  ) {
    try {
      const result = await this.client.api.put<
        IMMSBranchDevice,
        TApiResponse<IMMSBranchDevice>
      >(`/tms/api/v2/rest/device-device/${value.id}`, value);

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

  public async deleteDevice(
    id: number,
    callback?: IActionCallback<IMMSBranchDevice>,
  ) {
    try {
      const result = await this.client.api.delete<
        Partial<IMMSBranchDevice>,
        TApiResponse<IMMSBranchDevice>
      >(`/tms/api/v2/rest/device-device/${id}`);

      const data = result.data;
      if (callback) {
        callback?.success?.(data);
      }

      return data;
    } catch (error) {
      console.error('Error deleting requests:', error);
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }

  public async deleteBranchMember(
    id: number,
    callback?: IActionCallback<IBranchMemberRelation>,
  ) {
    try {
      const result = await this.client.api.delete<
        Partial<IBranchMemberRelation>,
        TApiResponse<IBranchMemberRelation>
      >(`/api/v2/rest/mix-portal/mix-db/bms_user_data/data-relationship/${id}`);

      const data = result.data;
      if (callback) {
        callback?.success?.(data);
      }

      return data;
    } catch (error) {
      console.error('Error deleting requests:', error);
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }

  public async createBranchMember(
    request: IBranchMemberRelation,
    callback?: IActionCallback<IBranchMemberRelation>,
  ) {
    try {
      const result = await this.client.api.post<
        Partial<IBranchMemberRelation>,
        TApiResponse<IBranchMemberRelation>
      >(
        `/api/v2/rest/mix-portal/mix-db/bms_user_data/data-relationship`,
        request,
      );

      const data = { ...result.data, ...request };
      if (callback) {
        callback?.success?.(data);
      }

      return data;
    } catch (error) {
      console.error('Error create requests:', error);
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }

  public async getBranchMemberRelationships(
    query: MixQuery,
    callback?: IActionCallback<IPaginationResultModel<IBranchMemberRelation>>,
  ) {
    const realQuery = query
      .equal('ParentDatabaseName', 'bms_branch')
      .equal('ChildDatabaseName', 'bms_user_data');

    try {
      const result = await this.client.api.post<
        MixQuery,
        TApiResponse<IPaginationResultModel<IBranchMemberRelation>>
      >('/tms/api/v2/rest/bms-data-relationship/filter', realQuery);

      const data = result.data;
      if (callback) {
        callback?.success?.(data);
      }
      let users;

      if (data.items.length > 0) {
        users = await this.client.api.post<
          MixQuery,
          TApiResponse<IPaginationResultModel<IBranchMemberRelation>>
        >(
          '/tms/api/v2/rest/bms-user-data/filter',
          new MixQuery().inRange(
            'Id',
            data.items.map((item) => item.childId.toString()).join(','),
          ),
        );
      } else {
        users = { data: { items: [] } };
      }

      data.items = data.items.map((item) => {
        const user = users.data.items.find((u) => u.id === item.childId);
        return {
          ...item,
          userData: user,
        } as IBranchMemberRelation;
      });

      return data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }
}
