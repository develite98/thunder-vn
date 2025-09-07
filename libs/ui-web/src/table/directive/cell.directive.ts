import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mixColumnCell]',
  standalone: false,
})
export class MixTableCellDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
