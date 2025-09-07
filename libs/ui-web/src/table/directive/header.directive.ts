import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mixColumnHeader]',
  standalone: false,
})
export class MixTableHeaderDirective {
  constructor(public template: TemplateRef<unknown>) {}
}
