import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { provideCurrency } from '@mixcore/ui/currency';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixInlineInputComponent } from '@mixcore/ui/inline-input';
import { MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';

import { MixStatusSelectComponent } from '@mixcore/ui/status-select';
import { CategoryFormComponent } from 'apps/ecommerce-bo/src/components';
import { ProductCategoryStore } from 'apps/ecommerce-bo/src/state';
import { IProductCategory } from 'apps/ecommerce-bo/src/types';

@Component({
  selector: 'mix-product-categories-page',
  templateUrl: './product-categories.page.html',
  imports: [
    MixTableModule,
    MixCopyTextComponent,
    MixButtonComponent,
    MixInlineInputComponent,
    MixStatusSelectComponent,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCurrency('vi-VN', 'VND')],
})
export class ProductCategoriesPage extends BasePageComponent {
  public store = inject(ProductCategoryStore);
  public router = injectMiniAppRouter();
  public dialog = injectDialog();
  public vcr = inject(ViewContainerRef);
  public toast = injectToastService();

  constructor() {
    super();

    this.store
      .search(new MixQuery().default(5).fromQueryParams(window.location.href))
      .subscribe();
  }

  public goDetail(id: number) {
    this.router.navigate(['product-category', id]);
  }

  public createCategory() {
    this.dialog.open(CategoryFormComponent, { vcr: this.vcr });
  }

  public onUpdatePriority(item: IProductCategory, priority: number) {
    if (!item || !priority || item.priority === priority) return;

    const { success, error } = this.toast.loading(
      this.translate('common.update.processing'),
    );

    this.store.updateData({ ...item, priority } as IProductCategory).subscribe({
      next: () => {
        success(this.translate('common.update.success'));
      },
      error: () => {
        error(this.translate('common.update.error'));
      },
    });
  }

  public onUpdateStatus(item: IProductCategory, status: EMixContentStatus) {
    if (!item || !status || item.status === status) return;

    const { success, error } = this.toast.loading(
      this.translate('common.update.processing'),
    );

    this.store.updateData({ ...item, status } as IProductCategory).subscribe({
      next: () => {
        success(this.translate('common.update.success'));
      },
      error: () => {
        error(this.translate('common.update.error'));
      },
    });
  }
}
