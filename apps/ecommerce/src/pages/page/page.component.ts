import { Component, computed, effect, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import {
  BreadcrumbComponent,
  PublicFooterComponent,
  PublicHeaderComponent,
} from '../../components';
import { PublicPageStore } from '../../stores';

@Component({
  selector: 'ecom-page',
  templateUrl: './page.component.html',
  imports: [PublicHeaderComponent, PublicFooterComponent, BreadcrumbComponent],
})
export class EcomPageComponent extends BasePageComponent {
  public slug = injectParams('slug');
  public store = inject(PublicPageStore);

  public breadcrumbs = computed(() => {
    return [
      {
        label: 'Trang chủ',
        url: '/',
      },
      {
        label: this.data()?.seo_title || 'Trang',
        url: `/p/${this.slug()}`,
      },
    ];
  });

  public data = this.store.selectEntityById(this.slug);
  public dataState = this.store.selectEntityStateById(this.slug);

  constructor() {
    super();
    effect(() => {
      const slug = this.slug();
      if (slug) {
        this.store.getById(slug).subscribe();
      }
    });
  }
}
