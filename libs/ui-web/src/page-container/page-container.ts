import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  NgZone,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectMiniAppRouter } from '@mixcore/app-config';
import { MixIconComponent } from '@mixcore/ui/icons';
import { ITabItem, MixTabsComponent } from '@mixcore/ui/tabs';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'mix-page-container',
  imports: [
    TranslocoPipe,
    MixTabsComponent,
    MixIconComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './page-container.html',
  styleUrl: './page-container.css',
  host: {
    class: 'h-full',
  },
})
export class MixPageContainerComponent {
  public scrollContainer =
    viewChild<ElementRef<HTMLElement>>('scrollContainer');

  public rightToolbarTpl = input<TemplateRef<HTMLElement> | null>(null);
  public miniAppRouter = injectMiniAppRouter();
  public backButton = input<boolean>(false);
  public defaultPage = input<string[]>([]);
  public destroyRef = inject(DestroyRef);
  public zone = inject(NgZone);
  public cdr = inject(ChangeDetectorRef);
  public loading = input<boolean | undefined>(false);

  public pageTitle = input<string>('');
  public pageTitleTpl = input<TemplateRef<HTMLElement> | null>(null);
  public pageDescription = input<string>('');
  public tabs = input<ITabItem[]>([]);

  public minimized = signal<boolean>(false);

  public onBackBtnClick() {
    if (history.length) {
      history.back();
    } else {
      this.miniAppRouter.navigate(this.defaultPage());
    }
  }

  ngAfterViewInit() {
    const el = this.scrollContainer();
    if (!el) return;

    this.zone.runOutsideAngular(() => {
      fromEvent(el.nativeElement, 'scroll')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const top = el.nativeElement.scrollTop;
          const breakPoint = 60;
          const minizied = this.minimized();

          if (top < breakPoint && minizied) {
            this.minimized.set(false);
            this.cdr.detectChanges();
          } else if (top > breakPoint && !minizied) {
            this.minimized.set(true);
            this.cdr.detectChanges();
          }
        });
    });
  }
}
