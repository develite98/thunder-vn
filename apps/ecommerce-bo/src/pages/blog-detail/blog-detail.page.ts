import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasePageComponent } from '@mixcore/base';
import { injectParams } from '@mixcore/router';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { ITabItem } from '@mixcore/ui/tabs';
import { injectDispatch } from '@ngrx/signals/events';
import { BlogDetailPageEvent } from '../../state/events/page.event';
import { BlogStore } from '../../state/store/page.store';

@Component({
  selector: 'mix-ecom-blog-detail',
  templateUrl: './blog-detail.page.html',
  imports: [RouterOutlet, MixPageContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcomBlogDetailPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(BlogStore);
  readonly event = injectDispatch(BlogDetailPageEvent);

  public data = this.store.selectEntityById(this.id);
  public dataState = this.store.selectEntityStateById(this.id);

  public tabs = computed(() => {
    const id = this.id();

    return [
      {
        title: 'ecommerce.page.detail.tab.info',
        icon: 'info',
        route: ['pages', id, 'info'],
      },
    ] as ITabItem[];
  });

  constructor() {
    super();

    effect(() => {
      const id = this.id();
      if (id) this.event.opened({ data: parseInt(id) });
    });
  }
}
