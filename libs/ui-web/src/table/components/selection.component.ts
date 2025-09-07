import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  type CellContext,
  type HeaderContext,
  injectFlexRenderContext,
} from '@tanstack/angular-table';

@Component({
  template: `
    <input
      class="checkbox"
      type="checkbox"
      [checked]="context.table.getIsAllRowsSelected()"
      [indeterminate]="context.table.getIsSomeRowsSelected()"
      (change)="context.table.toggleAllRowsSelected()"
    />
  `,
  host: {
    class: 'px-1 block',
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeadSelectionComponent<T> {
  context = injectFlexRenderContext<HeaderContext<T, unknown>>();
}

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
