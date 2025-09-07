import {
  IPaginationResultModel,
  MixQuery,
  TApiResponse,
} from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';

export function createFromTmsDb<T>(DB_NAME: string) {
  return () => {
    const client = injectMixClient();

    const filterData = async (query: MixQuery) => {
      try {
        const result = await client.api.post<
          MixQuery,
          TApiResponse<IPaginationResultModel<T>>
        >(`/tms/api/v2/rest/${DB_NAME}/filter`, query);
        return result.data;
      } catch (error) {
        throw error;
      }
    };

    const deleteData = async (dataId: number) => {
      try {
        const result = await client.api.delete<MixQuery, TApiResponse<T>>(
          `/tms/api/v2/rest/${DB_NAME}/${dataId}`,
        );
        return result.data;
      } catch (error) {
        throw error;
      }
    };

    const createData = async (item: Partial<T>) => {
      try {
        const result = await client.api.post<MixQuery, TApiResponse<T>>(
          `/tms/api/v2/rest/${DB_NAME}`,
          item,
        );
        return result.data;
      } catch (error) {
        throw error;
      }
    };

    const updateData = async (itemId: number, item: Partial<T>) => {
      try {
        const result = await client.api.put<MixQuery, TApiResponse<T>>(
          `/tms/api/v2/rest/${DB_NAME}/${itemId}`,
          item,
        );
        return result.data;
      } catch (error) {
        throw error;
      }
    };

    const getDataById = async (itemId: number) => {
      try {
        const result = await client.api.get<MixQuery, TApiResponse<T>>(
          `/tms/api/v2/rest/${DB_NAME}/${itemId}`,
        );
        return result.data;
      } catch (error) {
        throw error;
      }
    };

    return {
      fetchFn: (query: MixQuery) => filterData(query),
      getByIdFn: (id: number | string) => getDataById(id as number),
      deleteFn: (id: number | string) => deleteData(id as number),
      createFn: (data: Partial<T>) => createData(data),
      updateFn: (data: Partial<T>) => updateData((data as any)['id'], data),
    };
  };
}
