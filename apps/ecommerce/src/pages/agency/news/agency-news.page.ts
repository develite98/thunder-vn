import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixQuery } from '@mixcore/sdk-client';
import { MixIconComponent } from '@mixcore/ui/icons';
import { privateBlogStore } from 'apps/ecommerce/src/stores';

@Component({
  selector: 'page-agency-news',
  templateUrl: './agency-news.page.html',
  imports: [RouterLink, DatePipe, MixIconComponent, TranslocoPipe],
})
export class AgencyNewsPage {
  public store = inject(privateBlogStore);

  public range = computed(() => {
    const paging = this.store.pagingInfo();

    return {
      start: paging.pageIndex * paging.pageSize + 1,
      end:
        paging.pageIndex * paging.pageSize +
          this.store.dataEntities()?.length || 0,
    };
  });

  constructor() {
    const query = new MixQuery().default(10).equal('blog_type', 'internal');
    this.store.search(query).subscribe();
  }
}
