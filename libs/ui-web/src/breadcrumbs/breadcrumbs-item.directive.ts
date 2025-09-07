import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mixBreadcrumbItem]',
  standalone: true,
})
export class MixBreadcrumbItemDirective {
  @Input() public name = '';
  @Input() public icon = '';
  @Input() public active = false;

  @Input() public url: string | null = null;
  @Input() public templateRef?: TemplateRef<unknown>;
  @Input() public route: string[] = [];
}
