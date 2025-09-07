import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '@mixcore/ui/modal';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[commingSoon]',
  standalone: true,
})
export class ComingSoomDirective {
  public destroyRef = inject(DestroyRef);
  @Input() commingSoon: boolean | undefined = false;

  constructor(
    public elementRef: ElementRef,
    public modal: ModalService,
  ) {}

  ngOnInit() {
    if (this.commingSoon) {
      fromEvent(this.elementRef.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          (event as Event).stopImmediatePropagation();
          (event as Event).stopPropagation();
          (event as Event).preventDefault();

          this.modal
            .info(
              '😟 We are sorry for the inconvenience. This feature is still under development.',
              'Coming soon',
            )
            .subscribe();
        });
    }
  }
}
