import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { injectLocationHistory } from '@mixcore/router';

import { MixIconComponent } from '@mixcore/ui/icons';
import { filter } from 'rxjs';

export interface ITabItem {
  id: string;
  title: string;
  icon?: string;
  route?: string[];
  queryParams?: Record<string, unknown>;
}

@Component({
  selector: 'mix-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  imports: [MixIconComponent, TranslocoPipe],
})
export class MixTabsComponent {
  public className = input<string>('');
  public tabs = input<ITabItem[]>([]);
  public activeTabIndex = signal(0);

  public appRouter = inject(Router);
  public miniAppRouter = injectMiniAppRouter();
  public locationHistory = injectLocationHistory();

  constructor() {
    this.appRouter.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.checkTab();
      });

    effect(() => {
      if (this.tabs()?.length > 0) {
        this.checkTab();
      }
    });
  }

  public checkTab() {
    const activeIndex = this.tabs().findIndex((tab) =>
      this.miniAppRouter.isActive(tab.route || []),
    );

    if (activeIndex !== -1) {
      this.activeTabIndex.set(activeIndex);
    }
  }

  public onTabClick(paths: string[], params: Record<string, any> = {}) {
    this.miniAppRouter.navigate(paths || [], params, true);
  }
}
