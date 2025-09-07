import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
import { MixIconComponent } from '@mixcore/ui/icons';
import {
  BreadcrumbComponent,
  PublicFooterComponent,
  PublicHeaderComponent,
} from '../../components';
import { publicBlogStore } from '../../stores';

@Component({
  selector: 'mix-blogs-page',
  imports: [
    PublicHeaderComponent,
    PublicFooterComponent,
    RouterLink,
    BreadcrumbComponent,
    MixIconComponent,
    TranslocoPipe,
    DatePipe,
  ],
  templateUrl: './blogs-page.component.html',
  styleUrl: './blogs-page.component.css',
})
export class BlogsPageComponent {
  public store = inject(publicBlogStore);
  public breadcrumb = [
    {
      label: 'Trang chủ',
      url: '/',
    },
    {
      label: 'Bài viết',
      url: '/product',
    },
  ];

  public range = computed(() => {
    const paging = this.store.pagingInfo();

    return {
      start: paging.pageIndex * paging.pageSize + 1,
      end:
        paging.pageIndex * paging.pageSize +
          this.store.dataEntities()?.length || 0,
    };
  });

  public getSrc(url: string) {
    return url.startsWith('https://ecom.')
      ? url.replace('https://ecom.', 'https://')
      : `${url}`;
  }

  constructor() {
    this.store
      .search(
        new MixQuery()
          .default(5)
          .select('title', 'created_date_time', 'thumbnail', 'excerpt')
          .equal('status', EMixContentStatus.Published)
          .equal('blog_type', 'post'),
      )
      .subscribe();
  }
}
