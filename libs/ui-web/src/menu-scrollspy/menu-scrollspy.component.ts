import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

export interface IScrollspyMenuItem {
  id: string;
  label: string;
  labelClass?: string;
}

@Component({
  selector: 'mix-menu-scrollspy',
  standalone: true,
  templateUrl: './menu-scrollspy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixMenuScrollspyComponent implements OnInit, OnDestroy {
  private document = inject(DOCUMENT);

  public title = input<string>('');
  public items = input<IScrollspyMenuItem[]>([]);
  public scrollElementId = input<string>('');
  public stickyOffset = input<number>(0);

  public activeItemId = signal<string>('');

  private scrollElement: Element | null = null;
  private observer: IntersectionObserver | null = null;
  private scrollListener: ((event: Event) => void) | null = null;

  constructor() {
    effect(() => {
      const items = this.items();
      const scrollElementId = this.scrollElementId();

      if (items.length > 0 && scrollElementId) {
        this.initializeScrollspy();
      }
    });
  }

  ngOnInit() {
    this.initializeScrollspy();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private initializeScrollspy() {
    this.cleanup();

    const scrollElementId = this.scrollElementId();
    if (!scrollElementId) return;

    this.scrollElement = this.document.getElementById(scrollElementId);
    if (!this.scrollElement) return;

    this.setupIntersectionObserver();
    this.setupScrollListener();
  }

  private setupIntersectionObserver() {
    if (!this.scrollElement) return;

    const stickyOffset = this.stickyOffset();
    const topMargin = stickyOffset > 0 ? `-${stickyOffset}px` : '-20%';

    const options: IntersectionObserverInit = {
      root: this.scrollElement,
      rootMargin: `${topMargin} 0px -80% 0px`,
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        const topEntry = visibleEntries.reduce((closest, entry) => {
          return entry.boundingClientRect.top < closest.boundingClientRect.top
            ? entry
            : closest;
        });

        this.activeItemId.set(topEntry.target.id);
      }
    }, options);

    this.items().forEach((item) => {
      const element = this.document.getElementById(item.id);
      if (element && this.observer) {
        this.observer.observe(element);
      }
    });
  }

  private setupScrollListener() {
    if (!this.scrollElement) return;

    this.scrollListener = () => {
      this.updateActiveItem();
    };

    this.scrollElement.addEventListener('scroll', this.scrollListener, {
      passive: true,
    });
  }

  private updateActiveItem() {
    if (!this.scrollElement) return;

    const scrollTop = this.scrollElement.scrollTop;
    const items = this.items();
    const stickyOffset = this.stickyOffset();
    const offset = stickyOffset > 0 ? stickyOffset + 20 : 100;
    let activeId = '';

    for (let i = items.length - 1; i >= 0; i--) {
      const element = this.document.getElementById(items[i].id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const containerRect = this.scrollElement.getBoundingClientRect();
        const elementTop = rect.top - containerRect.top + scrollTop;

        if (scrollTop >= elementTop - offset) {
          activeId = items[i].id;
          break;
        }
      }
    }

    if (activeId && activeId !== this.activeItemId()) {
      this.activeItemId.set(activeId);
    }
  }

  public scrollToItem(itemId: string) {
    if (!this.scrollElement) return;

    const targetElement = this.document.getElementById(itemId);
    if (targetElement) {
      const containerRect = this.scrollElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const scrollTop = this.scrollElement.scrollTop;
      const stickyOffset = this.stickyOffset();
      const offset = stickyOffset > 0 ? stickyOffset + 20 : 20;

      const targetPosition =
        targetRect.top - containerRect.top + scrollTop - offset;

      this.scrollElement.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      this.activeItemId.set(itemId);
    }
  }

  private cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.scrollListener && this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }

    this.scrollElement = null;
  }
}
