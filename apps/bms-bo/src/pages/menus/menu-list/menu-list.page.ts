import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectQueryParams } from '@mixcore/router';
import { ESortDirection, MixQuery } from '@mixcore/sdk-client';
import { debouncedSignal } from '@mixcore/signal';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialog } from '@mixcore/ui/dialog';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { CreateStoreFormComponent } from 'apps/bms-bo/src/components';
import { IMenu, MenuStore } from 'apps/bms-bo/src/state';
import { explicitEffect } from 'ngxtension/explicit-effect';

@Component({
  selector: 'bms-menu-list-page',
  imports: [MixTableModule, MixButtonComponent, TranslocoPipe, DatePipe],
  template: `
    <mix-table
      [toolbarTpl]="toolar"
      [data]="store.dataEntities() || []"
      [paging]="store.pagingInfo()"
      [contextMenu]="contextMenu"
      [loading]="store.isLoading()"
      [(searchText)]="searchText"
      (goPrevious)="store.goPreviousPageRouter()"
      (rowClick)="goToDetail($event.id)"
      (goNext)="store.goNextPageRouter()"
      (goToPage)="store.goToPageRouter($event.pageIndex)"
      (refresh)="store.refresh()"
    >
      <ng-template #toolar>
        <mix-button
          (click)="createNew()"
          [prefixIcon]="'plus'"
          [color]="'primary'"
        >
          {{ 'bms.branch.create' | transloco }}
        </mix-button>
      </ng-template>

      <div
        mixTableColumn
        [header]="'common.label.displayName'"
        [key]="'displayName'"
      >
        <ng-template mixColumnCell let-row>
          <span class="font-medium">
            {{ row.data.name }}
          </span>
        </ng-template>
      </div>

      <div mixTableColumn [header]="'Country'" [key]="'countryName'">
        <ng-template mixColumnCell let-row>
          {{ row.data.countryName }}
        </ng-template>
      </div>

      <div mixTableColumn [header]="'Store name'" [key]="'storeName'">
        <ng-template mixColumnCell let-row>
          {{ row.data.storeName }}
        </ng-template>
      </div>

      <div mixTableColumn [header]="'Sale channel'" [key]="'saleChannelName'">
        <ng-template mixColumnCell let-row>
          {{ row.data.saleChannelName }}
        </ng-template>
      </div>

      <div
        mixTableColumn
        [header]="'common.label.updatedAt'"
        [key]="'lastModified'"
      >
        <ng-template mixColumnCell let-row>
          {{ row.data.lastModified | date }}
        </ng-template>
      </div>
    </mix-table>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuListPageComponent extends BasePageComponent {
  readonly store = inject(MenuStore);
  readonly queryParams = injectQueryParams();
  readonly router = injectMiniAppRouter();
  readonly dialog = injectDialog();

  readonly contextMenu: GridContextMenu<IMenu>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => this.deleteRecord(item),
      iconClass: 'text-error',
    },
  ];

  public searchText = signal<string | undefined>(undefined);
  public searchTextDebounced = debouncedSignal(this.searchText, 300);

  constructor() {
    super();

    explicitEffect([this.searchTextDebounced], ([keyword]) =>
      this.store.searchRouter(keyword),
    );

    explicitEffect([this.queryParams], ([params]) => {
      this.store
        .search(
          new MixQuery()
            .default(10)
            .sort('lastModified', ESortDirection.Desc)
            .withParams(params, {
              paramHandlers: {
                keyword: (value) => MixQuery.Like('name', value),
              },
            }),
        )
        .subscribe();

      const keyword = params['keyword'];
      if (keyword) this.searchText.set(keyword);
    });
  }

  public goToDetail(id: number) {
    this.router.navigate(['menus', id]);
  }

  public createNew() {
    this.dialog.open(CreateStoreFormComponent);
  }

  public deleteRecord(item: IMenu) {
    //
  }
}
