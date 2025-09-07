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
import { PageDetailPageEvent } from '../../state/events/page.event';
import { PageStore } from '../../state/store/page.store';

@Component({
  selector: 'mix-ecom-page-detail',
  templateUrl: './page-detail.page.html',
  imports: [RouterOutlet, MixPageContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcomPageDetailPage extends BasePageComponent {
  readonly id = injectParams('id');
  readonly store = inject(PageStore);
  readonly event = injectDispatch(PageDetailPageEvent);

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
