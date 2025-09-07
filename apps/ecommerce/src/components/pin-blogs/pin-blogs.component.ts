import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
import { highlightBlogStore } from '../../stores';

@Component({
  selector: 'ecom-pinned-blogs',
  template: `
    <div
      class="flex px-4 md:px-1 py-1 md:grid grid-cols-3 md:grid-cols-4 items-center w-full overflow-auto gap-4 no-scrollbar"
    >
      @for (blog of store.dataEntities(); track blog.id) {
        <div
          class="w-3/4 md:w-auto flex items-start gap-4 h-full blog-card border border-base-content/20 rounded-lg p-4 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div class="w-[102px] min-w-[102px] h-[102px]">
            <img
              [src]="blog.thumbnail"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div class="grow flex flex-col gap-2 h-full overflow-auto">
            <div class="text-sm font-bold">
              {{ blog.title }}
            </div>

            <div
              class="grow text-ellipsis overflow-hidden text-xs opacity-60 whitespace-nowrap"
            >
              - {{ blog.excerpt }}
            </div>

            <div
              class="mt-auto flex justify-end"
              (click)="router.navigate(['/b', blog.id])"
            >
              <a class="link link-primary link-hover text-xs">Xem thêm</a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .blog-card {
        filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.15));
        position: relative;
        background-color: #fff;
      }

      .blog-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -3px;
        height: 100%;
        width: 10px;
        color: #fff;
        background-clip: padding-box;
        background:
          repeating-linear-gradient(
              #e5e5e5,
              #e5e5e5 5px,
              transparent 0,
              transparent 9px,
              #e5e5e5 0,
              #e5e5e5 10px
            )
            0 / 1px 100% no-repeat,
          radial-gradient(
              circle at 0 7px,
              transparent,
              transparent 2px,
              #e5e5e5ee 0,
              #e5e5e5 3px,
              currentColor 0
            )
            1px 0 / 100% 10px repeat-y;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcomPinnedBlogsComponent {
  public store = inject(highlightBlogStore);
  public router = inject(Router);

  constructor() {
    this.store
      .search(
        new MixQuery()
          .default(3)
          .select('title', 'created_date_time', 'thumbnail', 'excerpt')
          .equal('status', EMixContentStatus.Published)
          .equal('blog_type', 'pin'),
      )
      .subscribe();
  }
}
