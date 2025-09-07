import { ContentChild, Directive, input } from '@angular/core';

import { MixTableCellDirective } from './cell.directive';
import { MixTableHeaderDirective } from './header.directive';

@Directive({
  selector: '[mixTableColumn]',
  standalone: false,
})
export class MixTableColumnDirective {
  public header = input<string>('');
  public key = input<string>('');

  @ContentChild(MixTableCellDirective, { static: true })
  public tplCell?: MixTableCellDirective;

  @ContentChild(MixTableHeaderDirective, { static: true })
  public tplHeader?: MixTableHeaderDirective;
}
