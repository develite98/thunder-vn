import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixIconComponent } from '@mixcore/ui/icons';
import { Header } from '@tanstack/angular-table';

@Component({
  selector: 'mix-table-sort',
  standalone: true,
  imports: [MixIconComponent, TranslocoPipe],
  template: `
    @if (canSort()) {
      <button
        type="button"
        class="flex items-center gap-1 cursor-pointer select-none"
        (click)="toggleSort()"
      >
        <span>{{ headerText() | transloco }}</span>
        <div class="flex flex-col">
          @let direction = sortDirection();
          @if (direction === 'asc') {
            <mix-icon icon="chevrons-up" class="w-3 h-3 text-secondary" />
          } @else if (direction === 'desc') {
            <mix-icon icon="chevrons-down" class="w-3 h-3 text-secondary" />
          } @else {
            <mix-icon
              icon="chevrons-up-down"
              class="w-3 h-3 text-base-content/40"
            />
          }
        </div>
      </button>
    } @else {
      <span>{{ headerText() | transloco }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSortComponent<T> {
  public header = input.required<Header<T, unknown>>();
  public headerText = input.required<string>();

  public sortDirection = input<'asc' | 'desc' | undefined>(undefined);

  public readonly canSort = computed(() => this.header().column.getCanSort());

  public readonly toggleSort = () => {
    this.header().column.toggleSorting();
  };
}
