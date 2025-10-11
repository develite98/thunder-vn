import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MixIconComponent } from '@mixcore/ui/icons';
import { TippyDirective } from '@ngneat/helipopper';
import { IColumnVisibility, IColumnVisibilityChange } from '../types';

export interface ColumnOption {
  id: string;
  label: string;
  visible: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'mix-column-visibility',
  standalone: true,
  imports: [MixIconComponent, TippyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      tabindex="0"
      role="button"
      class="btn btn-sm btn-ghost gap-2"
      [tp]="tpl"
      [tpDelay]="0"
      [tpVariation]="'popper'"
      [tpTrigger]="'mouseenter'"
      [tpPlacement]="'bottom-end'"
      [tpHideOnClick]="false"
    >
      Columns
      <mix-icon icon="chevron-down" [size]="14" />
    </div>

    <ng-template #tpl>
      <div
        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50"
      >
        <div class="menu-title text-xs font-medium mb-2">Show/Hide Columns</div>

        @for (column of availableColumns(); track column.id) {
          <label
            class="label cursor-pointer justify-start gap-3 py-2  mx-2"
            for="col-{{ column.id }}"
          >
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              id="col-{{ column.id }}"
              [checked]="column.visible"
              [disabled]="column.disabled"
              (change)="onColumnToggle(column.id, $event)"
            />
            <span class="label-text text-sm">{{ column.label }}</span>
          </label>
        }

        <div class="flex gap-2 mt-2 pt-2 border-t border-base-content/10">
          <button
            type="button"
            class="btn btn-xs btn-ghost flex-1"
            (click)="showAll()"
          >
            Show All
          </button>
          <button
            type="button"
            class="btn btn-xs btn-ghost flex-1"
            (click)="hideAll()"
          >
            Hide All
          </button>
        </div>
      </div>
    </ng-template>
  `,
})
export class ColumnVisibilityComponent {
  public readonly columns = input.required<ColumnOption[]>();
  public readonly columnVisibility = input<IColumnVisibility>({});
  public readonly onVisibilityChange = output<IColumnVisibilityChange>();

  public readonly availableColumns = computed(() => {
    const visibility = this.columnVisibility();
    return this.columns().map((col) => ({
      ...col,
      visible: visibility[col.id] !== false,
    }));
  });

  public onColumnToggle(columnId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newVisibility = {
      ...this.columnVisibility(),
      [columnId]: target.checked,
    };

    this.onVisibilityChange.emit({ columnVisibility: newVisibility });
  }

  public showAll(): void {
    const newVisibility: IColumnVisibility = {};
    this.columns().forEach((col) => {
      if (!col.disabled) {
        newVisibility[col.id] = true;
      }
    });

    this.onVisibilityChange.emit({ columnVisibility: newVisibility });
  }

  public hideAll(): void {
    const newVisibility: IColumnVisibility = {};
    this.columns().forEach((col) => {
      if (!col.disabled) {
        newVisibility[col.id] = false;
      }
    });

    this.onVisibilityChange.emit({ columnVisibility: newVisibility });
  }
}
