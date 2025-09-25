import {
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ECompareOperator } from '@mixcore/sdk-client';
import { IFilterConfiguration, IFilterValue } from '@mixcore/types';
import { MixIconComponent } from '@mixcore/ui/icons';
import { TippyDirective } from '@ngneat/helipopper';
import { OPERATOR_DISPLAY } from '../types';

@Component({
  selector: 'mix-input-query-builder',
  imports: [TippyDirective, ReactiveFormsModule, MixIconComponent],
  templateUrl: './input-query-builder.component.html',
  standalone: true,
  styleUrls: ['./input-query-builder.component.css'],
})
export class MixInputQueryBuilderComponent {
  readonly OPERATOR_DISPLAY = OPERATOR_DISPLAY;

  public filterOptions = input<IFilterConfiguration[]>([]);
  public tempFilter = signal<Partial<IFilterValue> | null>(null);
  public filterValues = model<IFilterValue[]>([]);
  public valueChange = output<IFilterValue[]>();

  public element = viewChild<TippyDirective>('tippyRef');
  public inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  public searchText = new FormControl('');
  public searchText$ = toSignal(this.searchText.valueChanges);
  public activeItemIndex = signal(0);

  public filterOptionsMap = computed(() => {
    const map = new Map<string, IFilterConfiguration>();
    this.filterOptions().forEach((f) => map.set(f.fieldName, f));
    return map;
  });

  public filterValuesDisplay = computed(() => {
    return this.filterValues().map((f) => {
      const map = this.filterOptionsMap();
      const itemConfig = map.get(f.fieldName || '');

      return {
        ...f,
        label: itemConfig?.label || f.fieldName,
      };
    });
  });

  public tempFilterLabel = computed(() => {
    const item = this.tempFilter();
    if (!item) return '';

    const map = this.filterOptionsMap();
    const itemConfig = map.get(item.fieldName || '');
    return itemConfig?.label || item.fieldName || '';
  });

  public searchFilterOption = computed(() => {
    const text = this.searchText$();
    return this.filterOptions().filter((f) =>
      f.label.toLowerCase().includes(text?.toLowerCase() || ''),
    );
  });

  public operatorOptions = computed(() => {
    const item = this.tempFilter();
    if (!item) return [];

    const text = this.searchText$();
    const map = this.filterOptionsMap();
    const itemConfig = map.get(item.fieldName || '');
    if (!itemConfig) return [];

    return (
      itemConfig.allowdOperators?.filter((x) =>
        x.toLowerCase().includes(text?.toLowerCase() || ''),
      ) || []
    );
  });

  public isChooseField = computed(() => {
    const currentFilter = this.tempFilter();
    return !currentFilter || !currentFilter.fieldName;
  });

  public isChooseOperator = computed(() => {
    const currentFilter = this.tempFilter();
    return (
      currentFilter && currentFilter.fieldName && !currentFilter.compareOperator
    );
  });

  public onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
      case 'Esc':
        event.preventDefault();
        this.element()?.hide();
        this.inputEl()?.nativeElement?.blur();
        break;
      case 'ArrowDown':
      case 'Tab': {
        if (this.isChooseField()) {
          const items = this.searchFilterOption();
          if (items.length) {
            event.preventDefault();
            this.activeItemIndex.set(
              (this.activeItemIndex() + 1) % items.length,
            );
          }
        } else if (this.isChooseOperator()) {
          const items = this.operatorOptions();
          if (items.length) {
            event.preventDefault();
            this.activeItemIndex.set(
              (this.activeItemIndex() + 1) % items.length,
            );
          }
        }

        break;
      }
      case 'ArrowUp': {
        if (this.isChooseField()) {
          const items = this.searchFilterOption();
          if (items.length) {
            event.preventDefault();
            this.activeItemIndex.set(
              (this.activeItemIndex() - 1) % items.length,
            );
          }
        } else if (this.isChooseOperator()) {
          const items = this.operatorOptions();
          if (items.length) {
            event.preventDefault();
            this.activeItemIndex.set(
              (this.activeItemIndex() - 1) % items.length,
            );
          }
        }
        break;
      }
      case 'Enter': {
        const tempFilter = this.tempFilter();
        if (this.isChooseField()) {
          const items = this.searchFilterOption();
          const item = items[this.activeItemIndex()];
          if (item) {
            event.preventDefault();
            this.tempFilter.set({
              value: undefined,
              compareOperator: undefined,
              fieldName: item.fieldName,
            });

            this.activeItemIndex.set(0);
          }
        } else if (this.isChooseOperator()) {
          const operator = this.operatorOptions()[this.activeItemIndex()];
          if (operator) {
            event.preventDefault();
            this.tempFilter.set({ ...tempFilter, compareOperator: operator });
            this.activeItemIndex.set(0);
          }
        } else if (tempFilter && tempFilter.compareOperator) {
          if (this.searchText$()) {
            event.preventDefault();
            const filter = {
              ...tempFilter,
              value: this.searchText$() || '',
            };

            this.filterValues.set([
              ...this.filterValues(),
              filter as IFilterValue,
            ]);
            this.tempFilter.set(null);
            this.reset();
          }
        }

        break;
      }
      case 'Backspace': {
        if (this.searchText$()) return;

        event.preventDefault();
        const item = this.tempFilter();
        if (item) {
          if (item?.compareOperator) {
            this.tempFilter.set({ ...item, compareOperator: undefined });
            return;
          }

          if (item?.value) {
            this.tempFilter.set({ ...item, value: undefined });
            return;
          }

          this.tempFilter.set(null);
        } else {
          const items = this.filterValues();
          const lastItem = items.pop();
          if (!lastItem) return;

          this.filterValues.set([...items]);
          this.tempFilter.set({
            fieldName: lastItem?.fieldName,
            compareOperator: lastItem?.compareOperator,
          });

          this.searchText.patchValue(lastItem?.value?.toString() || '');
        }

        break;
      }
    }
  }

  public removeFilter(index: number) {
    const items = this.filterValues();
    items.splice(index, 1);
    this.filterValues.set([...items]);
  }

  public emitChange() {
    this.valueChange.emit(this.filterValues());
  }

  public chooseField(field: IFilterConfiguration) {
    this.tempFilter.set({
      value: undefined,
      compareOperator: undefined,
      fieldName: field.fieldName,
    });

    this.focusInput();
    this.reset();
  }

  public chooseOperator(operator: ECompareOperator) {
    const item = this.tempFilter();
    if (!item) return;

    this.tempFilter.set({ ...item, compareOperator: operator });
    this.focusInput();
    this.reset();
  }

  public reset() {
    this.activeItemIndex.set(0);
    this.searchText.patchValue('');
  }

  public focusInput() {
    this.inputEl()?.nativeElement?.focus();
  }
}
