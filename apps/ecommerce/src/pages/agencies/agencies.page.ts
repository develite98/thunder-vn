import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseComponent } from '@mixcore/base';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import {
  BreadcrumbComponent,
  LocationSelectorComponent,
  Province,
  PublicFooterComponent,
  PublicHeaderComponent,
  ViewEmbedMapComponent,
  Ward,
} from '../../components';
import { injectUiConfig } from '../../helper';
import { publicAgencyStore } from '../../stores';
import { IStoreConfiguration } from '../../types';

@Component({
  selector: 'mix-agencies-page',
  imports: [
    PublicHeaderComponent,
    PublicFooterComponent,
    BreadcrumbComponent,
    ReactiveFormsModule,
    MixCopyTextComponent,
    LocationSelectorComponent,
  ],
  templateUrl: './agencies.page.html',
  styleUrls: ['./agencies.page.css'],
})
export class AgenciesPageComponent extends BaseComponent {
  public store = inject(publicAgencyStore);
  public dialog = injectDialog();

  public storeConfig = injectUiConfig<IStoreConfiguration>('store-config');
  public sanitizer = inject(DomSanitizer);
  public mapUrl = signal<SafeResourceUrl | null>(null);
  public modal = injectModalService();
  public toast = injectToastService();
  public breadcrumb = [
    {
      label: 'Trang chủ',
      url: '/',
    },
    {
      label: 'Cửa hàng gần đây',
      url: '/contact',
    },
  ];

  public searchText = signal('');
  public province = signal<Province | undefined>(undefined);
  public ward = signal<Ward | undefined>(undefined);

  public displayAgencies = computed(() => {
    let data = this.store.dataEntities();
    const text = this.searchText().toLowerCase().trim();
    const provice = this.province();
    const ward = this.ward();
    console.log(ward);

    if (provice) {
      data = data.filter((d) =>
        d.addresses?.data?.some((x) => x.province.name === provice.province),
      );

      if (ward) {
        data = data.filter((d) =>
          d.addresses?.data?.some((x) => x.ward?.name === ward.name),
        );
      }
    }

    return data.filter((d) => d.title.toLowerCase().includes(text));
  });

  constructor() {
    super();
  }

  public showMap(map: string | undefined) {
    this.dialog.open(ViewEmbedMapComponent, { data: { map } });
  }
}
