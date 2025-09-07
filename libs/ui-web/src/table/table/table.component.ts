import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
  output,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';

import { MixTableColumnDirective } from '../directive';

import {
  Cell,
  ColumnDef,
  createAngularTable,
  flexRenderComponent,
  getCoreRowModel,
  getSortedRowModel,
  Header,
  SortingState,
} from '@tanstack/angular-table';

import {
  TableHeadSelectionComponent,
  TableRowSelectionComponent,
} from '../components/selection.component';

import { PaginationModel } from '@mixcore/sdk-client';
import {
  GridContextMenu,
  ITableFilter,
  ITableFilterValue,
  ITableSort,
  ITableSortChange,
} from '../types';

@Component({
  selector: 'mix-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table.component.css'],
  standalone: false,
})
export class MixTableComponent<T> {
  public cols = contentChildren(MixTableColumnDirective, {
    descendants: true,
  });
  public searchBarTpl = input<TemplateRef<unknown> | undefined>(undefined);
  public toolbarTpl = input<TemplateRef<unknown> | undefined>(undefined);
  public pinnedCols = input<Record<string, boolean>>({
    select: true,
  });

  public hideToolbar = input<boolean>(false);
  public hideFilter = input<boolean>(true);

  public hideSelection = input<boolean>(false);
  public loading = input<boolean>(false);
  public data = input<T[]>([]);
  public paging = input(PaginationModel.default());
  public searchText = model<string | undefined>('');
  public searchTextPlaceHolder = input<string>('common.typeToSearch');

  public contextMenu = input<GridContextMenu<T>[]>([]);
  public viewMode = model<'table' | 'card'>('table');

  public filters = input<ITableFilter[]>([]);
  public filterValue = model<ITableFilterValue[]>([]);
  public onFilterChange = output<ITableFilterValue[]>();

  public enableSorting = input<boolean>(true);
  public serverSide = input<boolean>(false); // Enable server-side sorting mode
  public sorting = model<ITableSort[]>([]);
  public onSortChange = output<ITableSortChange>();

  public goNext = output<void>();
  public goPrevious = output<void>();
  public goToPage = output<{ pageIndex: number }>();

  public refresh = output<void>();
  public rowClick = output<T>();

  public readonly onRowClick = (data: T) => this.rowClick.emit(data);
  public readonly onGoNext = () => this.goNext.emit();
  public readonly onGoPrevious = () => this.goPrevious.emit();
  public readonly onRefresh = () => this.refresh.emit();
  public readonly onGoToPage = (pageIndex: number) =>
    this.goToPage.emit({ pageIndex });
  public readonly handleFilterChange = (value: ITableFilterValue[]) =>
    this.onFilterChange.emit(value);
  public readonly handleSortChange = (sorts: ITableSort[]) => {
    this.sorting.set(sorts);
    this.onSortChange.emit({ sorts });
  };

  public table: ReturnType<typeof createAngularTable<T>> | undefined =
    undefined;

  public columns = computed(() => {
    const columnDefs: ColumnDef<T>[] = !this.hideSelection()
      ? [
          {
            id: 'select',
            size: 20,
            enablePinning: true,
            enableSorting: false,
            header: () => {
              return flexRenderComponent(TableHeadSelectionComponent);
            },
            cell: () => {
              return flexRenderComponent(TableRowSelectionComponent);
            },
          },
        ]
      : [];

    this.cols()?.forEach((x) => {
      columnDefs.push({
        accessorKey: x.key(),
        enablePinning: false,
        enableSorting: this.enableSorting(),
        header: x.header(),
        id: x.key(),

        cell: x.tplCell?.template
          ? () => x.tplCell?.template
          : (info) => {
              return info.getValue();
            },
      });
    });

    if (this.contextMenu()?.length) {
      columnDefs.push({
        id: 'action',
        size: 20,
        enablePinning: true,
        enableSorting: false,
      });
    }

    return columnDefs;
  });

  public sortingState = computed((): SortingState => {
    return this.sorting().map((sort) => ({
      id: sort.field,
      desc: sort.direction === 'desc',
    }));
  });

  public sortingStateDict = computed(() => {
    const dict: Record<string, 'asc' | 'desc'> = {};

    this.sorting().forEach((sort) => {
      dict[sort.field] = sort.direction;
    });

    return dict;
  });

  public range = computed(() => {
    const paging = this.paging();

    return {
      start: paging.pageIndex * paging.pageSize + 1,
      end: paging.pageIndex * paging.pageSize + this.data()?.length || 0,
    };
  });

  public getRowData = (cell: Cell<T, unknown>) => {
    return { ...cell.getContext(), data: cell.row.original };
  };

  public getHeaderText = (header: Header<T, unknown>): string => {
    const headerDef = header.column.columnDef.header;
    if (typeof headerDef === 'string') {
      return headerDef;
    }
    return header.column.id || '';
  };

  public hasContextMenu = computed(() => this.contextMenu().length > 0);
  public dataLength = computed(() => this.data().length);
  public isTableView = computed(() => this.viewMode() === 'table');

  trackByRowId: TrackByFunction<{ id: string }> = (
    index: number,
    row: { id: string },
  ) => row.id;

  trackByCellId: TrackByFunction<{ id: string }> = (
    index: number,
    cell: { id: string },
  ) => cell.id;

  trackByHeaderId: TrackByFunction<{ id: string }> = (
    index: number,
    header: { id: string },
  ) => header.id;

  constructor() {
    effect(() => {
      this.table = createAngularTable(() => ({
        data: this.data() || [],
        columns: this.columns() || [],
        state: {
          sorting: this.sortingState(),
        },
        enableSorting: this.enableSorting(),
        enableSortingRemoval: true,
        manualSorting: this.serverSide(), // Enable manual sorting for server-side
        onSortingChange: (updaterOrValue) => {
          const newSorting =
            typeof updaterOrValue === 'function'
              ? updaterOrValue(this.sortingState())
              : updaterOrValue;

          const sorts: ITableSort[] = newSorting.map((sort) => ({
            field: sort.id,
            direction: sort.desc ? 'desc' : 'asc',
          }));

          this.handleSortChange(sorts);
        },
        getCoreRowModel: getCoreRowModel(),
        // Only enable client-side sorting when server-side is disabled
        ...(this.serverSide()
          ? {}
          : { getSortedRowModel: getSortedRowModel() }),
      }));
    });
  }
}
