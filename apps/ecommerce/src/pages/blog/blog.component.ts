import { Component, computed, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import {
  BreadcrumbComponent,
  PublicFooterComponent,
  PublicHeaderComponent,
} from '../../components';
import { EcomPinnedBlogsComponent } from '../../components/pin-blogs/pin-blogs.component';
import { publicBlogDetailStore } from '../../stores';

@Component({
  selector: 'ecom-blog-detail',
  templateUrl: './blog.component.html',
  imports: [
    PublicHeaderComponent,
    PublicFooterComponent,
    BreadcrumbComponent,
    EcomPinnedBlogsComponent,
  ],
  providers: [],
})
export class EcomBlogComponent extends BasePageComponent {
  public id = injectParams('id');
  public store = inject(publicBlogDetailStore);

  public breadcrumbs = computed(() => {
    return [
      {
        label: 'Trang chủ',
        url: '/',
      },
      {
        label: this.data()?.seo_title || 'Trang',
        url: `/b/${this.id()}`,
      },
    ];
  });

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  constructor() {
    super();

    const id = this.id();
    if (id) {
      this.store.getById(id).subscribe();
    }
  }
}
