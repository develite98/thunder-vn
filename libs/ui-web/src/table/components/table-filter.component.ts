import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { ECompareOperator } from '@mixcore/sdk-client';
import { ITableFilter, ITableFilterValue } from '../types';

const COMPARE_OPERATORS: Record<ECompareOperator, string> = {
  [ECompareOperator.Equal]: 'common.equal',
  [ECompareOperator.NotEqual]: 'common.notEqual',
  [ECompareOperator.GreaterThan]: 'common.greaterThan',
  [ECompareOperator.LessThan]: 'common.lessThan',
  [ECompareOperator.GreaterThanOrEqual]: 'common.greaterThanOrEqual',
  [ECompareOperator.LessThanOrEqual]: 'common.lessThanOrEqual',
  [ECompareOperator.Contain]: 'common.contains',
  [ECompareOperator.NotContain]: 'common.notContains',
  [ECompareOperator.Like]: 'common.like',
  [ECompareOperator.ILike]: 'common.iLike',
  [ECompareOperator.InRange]: 'common.inRange',
};

@Component({
  selector: 'mix-table-filter',
  standalone: false,
  template: `
    @let selected = selectedFilter();
    @let sltFilterValues = filterValue();
    @let totalFilter = sltFilterValues?.length || 0;

    <div class="indicator">
      <button
        class="btn"
        [tp]="filterTpl"
        [tpVariation]="'popper'"
        [tpPlacement]="'bottom-start'"
        (tpOnHide)="reset()"
      >
        <mix-icon icon="funnel"></mix-icon>
        @if (totalFilter) {
          <div class="indicator-item badge badge-secondary badge-xs">
            {{ totalFilter }}
          </div>
        }
      </button>
    </div>

    <ng-template #filterTpl let-hide>
      <div
        class="p-4 bg-base-100 border border-base-content/10 rounded-box z-1 w-[560px] p-2 relative pt-6"
      >
        <button
          (click)="hide(); formValue.patchValue(undefined)"
          class="btn btn-sm btn-ghost rounded-full btn-square absolute top-2 right-2 z-2"
        >
          <mix-icon icon="x"></mix-icon>
        </button>
        <div class="grid grid-cols-12 gap-4 w-full">
          <div class="col-span-6">
            <div class="ps-1 mb-1 text-sm font-bold">Field:</div>

            <mix-select
              class="w-full"
              [items]="filters()"
              [value]="selectedFilter()?.fieldName"
              (valueChange)="
                selectedFilterId.set($event); formValue.patchValue(undefined)
              "
              [valueKey]="'fieldName'"
              [labelProcess]="labelProcess"
            ></mix-select>
          </div>

          <div class="col-span-6">
            <div class="ps-1 mb-1 text-sm font-bold">Operator:</div>
            <mix-select
              [formControl]="formOperator"
              [items]="selected?.compareOperator || []"
              [labelProcess]="labelOperatorProcess"
              class="w-full"
            ></mix-select>
          </div>

          @let operatorValue = formOperator.valueChanges | async;
          @if (operatorValue) {
            <div class="col-span-12">
              <div class="ps-1 mb-1 text-sm font-bold">Value:</div>

              @if (selected?.options) {
                <mix-select
                  [items]="selected?.options || []"
                  [valueKey]="'value'"
                  [formControl]="formValue"
                  [labelProcess]="labelProcess2"
                  class="w-full"
                ></mix-select>
              } @else {
                <input
                  [formControl]="formValue"
                  class="input input-bordered w-full"
                  placeholder="Type value here"
                />
              }
            </div>
          }
        </div>
        <div class="mt-4">
          @let value = formValue.valueChanges | async;
          <button
            (click)="addFilter()"
            class="btn btn-ghost btn-primary btn-sm"
            [disabled]="value === undefined || value === null"
          >
            + Add filter
          </button>
        </div>

        @let sltTempFilterValues = tempFilterValues();
        @let sltTempRemoveFilterValues = tempRemoveFilterValues();

        <div class="flex items-center gap-2 flex-wrap mt-4">
          @for (
            value of sltFilterValues;
            track value.fieldName;
            let i = $index
          ) {
            <mix-table-filter-display
              (onClick)="removeFilter(i)"
              [filterValue]="value"
              [filter]="filterDictByKey()[value.fieldName]"
            ></mix-table-filter-display>
          }

          @for (
            value of sltTempFilterValues;
            track value.fieldName;
            let i = $index
          ) {
            <mix-table-filter-display
              (onClick)="removeFilter(i, true)"
              [filterValue]="value"
              [filter]="filterDictByKey()[value.fieldName]"
            ></mix-table-filter-display>
          }

          @for (
            value of sltTempRemoveFilterValues;
            track value.fieldName;
            let i = $index
          ) {
            <mix-table-filter-display
              (onClick)="removeFilter(i, true)"
              [filterValue]="value"
              [filter]="filterDictByKey()[value.fieldName]"
              [isDeleted]="true"
            ></mix-table-filter-display>
          }
        </div>

        <div
          class="border-t border-base-content/20 border-dashed flex items-center  gap-2 pt-2 mt-4"
        >
          <button class="btn btn-ghost">Clear filter(s)</button>

          <button class="btn btn-ghost ms-auto">Cancel</button>

          <button class="btn btn-primary" (click)="onSubmit()">
            Apply filter(s)
          </button>
        </div>
      </div>
    </ng-template>
  `,
})
export class TableFilterComponent {
  public translateSrv = inject(TranslocoService);

  public filters = input<ITableFilter[]>([]);
  public filterDictByKey = computed(() => {
    return this.filters().reduce(
      (acc, filter) => {
        acc[filter.fieldName] = filter;
        return acc;
      },
      {} as Record<string, ITableFilter>,
    );
  });

  public filterValue = model<ITableFilterValue[]>([]);
  public tempFilterValues = model<ITableFilterValue[]>([]);
  public tempRemoveFilterValues = model<ITableFilterValue[]>([]);

  public onFilterChange = output<ITableFilterValue[]>();

  public selectedFilterId = model<string | undefined>(undefined);
  public selectedFilter = computed(() => {
    return this.filters().find((x) => x.fieldName === this.selectedFilterId());
  });

  public formValue = new FormControl(undefined, [Validators.required]);
  public formOperator = new FormControl(undefined, [Validators.required]);

  readonly labelProcess = (item: ITableFilter) => item.label;
  readonly labelProcess2 = (item: ITableFilterValue) => item.label || '';
  readonly labelOperatorProcess = (item: ECompareOperator) =>
    this.translateSrv.translate(COMPARE_OPERATORS[item]);

  constructor() {
    effect(() => {
      const options = this.filters();
      if (options.length > 0 && !this.selectedFilterId()) {
        this.selectedFilterId.set(options[0]?.fieldName);
      }
    });
  }

  public addFilter() {
    const filterId = this.selectedFilterId();
    const value = this.formValue.value;
    const operator = this.formOperator.value;
    if (!filterId || value === undefined || value === null || !operator) return;

    const current = this.tempFilterValues();
    current.push({
      fieldName: filterId,
      value: value,
      label: '',
      compareOperator: operator,
    });

    this.tempFilterValues.set(current);
  }

  public removeFilter(index: number, fromTemp = false) {
    const current = fromTemp ? this.tempFilterValues() : this.filterValue();
    current.splice(index, 1);

    if (fromTemp) {
      this.tempFilterValues.set(current);
    } else {
      const currentTemp = this.tempRemoveFilterValues();
      currentTemp.push(current[index]);
      this.tempRemoveFilterValues.set(currentTemp);
    }
  }

  public onSubmit() {
    const current = this.filterValue();
    const temp = this.tempFilterValues();

    current.push(...temp);

    this.filterValue.set(current);
    this.onFilterChange.emit(current);
    this.tempFilterValues.set([]);
    this.tempRemoveFilterValues.set([]);
  }

  public reset() {
    this.selectedFilterId.set(undefined);
    this.formValue.patchValue(undefined);
    this.formOperator.patchValue(undefined);
    this.tempFilterValues.set([]);
    this.tempRemoveFilterValues.set([]);
  }
}

@Component({
  selector: 'mix-table-filter-display',
  standalone: false,
  template: `
    <div
      (click)="onClick.emit()"
      class="badge badge-soft badge-info badge-sm cursor-pointer hover:opacity-60"
    >
      {{ filter()?.label }} {{ operatorDisplay() }}
      {{ valueDisplay() }}

      <mix-icon [size]="16" icon="x" />
    </div>
  `,
})
export class TableFilterDisplayComponent {
  public translateSrv = inject(TranslocoService);

  public isDeleted = input<boolean>(false);
  public filterValue = input<ITableFilterValue>();
  public filter = input<ITableFilter>();

  public onClick = output();

  public optionDictByKey = computed(() => {
    return this.filter()?.options?.reduce(
      (acc, option) => {
        acc[option.value!.toString()] = option;
        return acc;
      },
      {} as Record<string, ITableFilterValue>,
    );
  });

  public valueDisplay = computed(() => {
    const filter = this.filter();
    const filterValue = this.filterValue()?.value?.toString() || '';

    if (filter?.options?.length)
      return this.optionDictByKey()?.[filterValue]?.label;

    return filterValue;
  });

  public operatorDisplay = computed(() => {
    const filterValue = this.filterValue();
    if (!filterValue) return '';

    if (!filterValue.compareOperator) return '';

    return this.translateSrv
      .translate(COMPARE_OPERATORS[filterValue.compareOperator])
      ?.toLocaleLowerCase();
  });
}
