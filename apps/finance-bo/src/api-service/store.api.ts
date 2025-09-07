import { Injectable } from '@angular/core';
import { IActionCallback, IPaginationResultModel } from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { IBranch, IBrand } from '@mixcore/shared-domain';

@Injectable({ providedIn: 'root' })
export class StoreApi {
  public client = injectMixClient();

  public async getStores(
    callback?: IActionCallback<IPaginationResultModel<IBranch>>,
  ) {
    try {
      const result =
        await this.client.api.get<IPaginationResultModel<IBrand>>(
          `/bms/api/brand`,
        );

      const data = result.data;
      const branches = (data.items || [])
        .map((brand) =>
          brand.branches.map((x) => {
            return {
              ...x,
              brandId: brand.id,
              brandName: brand.name,
            } as IBranch;
          }),
        )
        .flat();
      const paginationResult: IPaginationResultModel<IBranch> = {
        pagingData: {
          total: branches.length,
          page: 1,
          pageSize: branches.length,
          pageIndex: 0,
        },
        items: branches,
      };

      callback?.success?.(paginationResult);

      return paginationResult;
    } catch (error) {
      callback?.error?.(error);
      throw error;
    } finally {
      callback?.finally?.();
    }
  }
}
