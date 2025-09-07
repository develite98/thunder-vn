import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { startWith } from 'rxjs';
import { MixBreadcrumbItemDirective } from './breadcrumbs-item.directive';

@Component({
  selector: 'mix-breadcrumbs',
  standalone: true,
  imports: [NgTemplateOutlet, TranslocoPipe],
  templateUrl: './breadcrumbs.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MixBreadcrumbsComponent implements AfterViewInit {
  @Input() showHome = true;

  @ContentChildren(MixBreadcrumbItemDirective)
  public items!: QueryList<MixBreadcrumbItemDirective>;

  public displayItems = signal<MixBreadcrumbItemDirective[]>([]);
  public destroyRef = inject(DestroyRef);
  public router = injectMiniAppRouter();

  @Output() public itemClick = new EventEmitter<{
    data: MixBreadcrumbItemDirective;
    index: number;
    last: boolean;
  }>();

  ngAfterViewInit() {
    this.items.changes
      .pipe(startWith(this.items), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.displayItems.set(this.items.toArray());
      });
  }

  onItemClick(item: MixBreadcrumbItemDirective) {
    this.router.navigate(item.route || [], undefined, true);
  }
}
