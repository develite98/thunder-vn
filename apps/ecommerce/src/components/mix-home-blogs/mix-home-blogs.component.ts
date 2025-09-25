import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
import { publicBlogStore } from '../../stores';

@Component({
  selector: 'mix-home-blogs',
  imports: [RouterLink, SlicePipe],
  templateUrl: './mix-home-blogs.component.html',
  styleUrl: './mix-home-blogs.component.css',
})
export class MixHomeBlogsComponent {
  public store = inject(publicBlogStore);

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
