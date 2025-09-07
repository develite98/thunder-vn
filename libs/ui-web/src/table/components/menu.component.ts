import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  template: `
    <input
      type="checkbox"
      class="checkbox"
      [checked]="context.row.getIsSelected()"
      (change)="context.row.getToggleSelectedHandler()($event)"
    />
  `,
  host: {
    class: 'px-1 block',
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowSelectionComponent<T> {
  context = injectFlexRenderContext<CellContext<T, unknown>>();
}
