import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[mixAutoFocus]',
  standalone: true,
})
export class MixInputAutoFocus {
  public el = inject(ElementRef);

  ngAfterViewInit() {
    if (this.el && this.el.nativeElement instanceof HTMLInputElement) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 100);
    }
  }
}
