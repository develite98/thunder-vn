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
import {
  Cell,
  ColumnDef,
  createAngularTable,
  flexRenderComponent,
  getCoreRowModel,
  getSortedRowModel,
  Header,
  Row,
  SortingState,
} from '@tanstack/angular-table';

import { PaginationModel } from '@mixcore/sdk-client';
import { IFilterConfiguration, IFilterValue } from '@mixcore/types';

import {
  TableHeadSelectionComponent,
  TableRowSelectionComponent,
} from '../components/selection.component';
import { MixTableColumnDirective } from '../directive';
import { GridContextMenu, ITableSort, ITableSortChange } from '../types';

@Component({
  selector: 'mix-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MixTableComponent<T> {
  public readonly cols = contentChildren(MixTableColumnDirective, {
    descendants: true,
  });

  public readonly searchBarTpl = input<TemplateRef<unknown> | undefined>(
    undefined,
  );
  public readonly toolbarTpl = input<TemplateRef<unknown> | undefined>(
    undefined,
  );

  public readonly pinnedCols = input<Record<string, boolean>>({
    select: true,
  });
  public readonly hideToolbar = input<boolean>(false);
  public readonly hideFilter = input<boolean>(true);
  public readonly hideSelection = input<boolean>(false);
  public readonly tableHeight = input<string>('50vh');
  public readonly loading = input<boolean>(false);
  public readonly enableSorting = input<boolean>(true);
  public readonly serverSide = input<boolean>(false);
  public readonly toggleRowSelectOnRowClick = input<boolean>(false);

  public readonly data = input<T[]>([]);
  public readonly paging = input(PaginationModel.default());
  public readonly contextMenu = input<GridContextMenu<T>[]>([]);
  public readonly filterOptions = input<IFilterConfiguration[]>([]);

  public readonly searchTextPlaceHolder = input<string>('common.typeToSearch');

  public readonly searchText = model<string | undefined | null>(null);
  public readonly viewMode = model<'table' | 'card'>('table');
  public readonly filterValues = model<IFilterValue[]>([]);
  public readonly sorting = model<ITableSort[]>([]);
  public readonly rowSelection = model<Record<string, boolean>>({});

  public readonly onFilterChange = output<IFilterValue[]>();
  public readonly onSortChange = output<ITableSortChange>();
  public readonly goNext = output<void>();
  public readonly goPrevious = output<void>();
  public readonly goToPage = output<{ pageIndex: number }>();
  public readonly refresh = output<void>();
  public readonly rowClick = output<T>();

  public readonly onRowClick = (data: T) => this.rowClick.emit(data);
  public readonly onGoNext = () => this.goNext.emit();
  public readonly onGoPrevious = () => this.goPrevious.emit();
  public readonly onRefresh = () => this.refresh.emit();
  public readonly onGoToPage = (pageIndex: number) =>
    this.goToPage.emit({ pageIndex });

  public table: ReturnType<typeof createAngularTable<T>> | undefined =
    undefined;

  public readonly columns = computed(() => {
    const columnDefs: ColumnDef<T>[] = this.hideSelection()
      ? []
      : [this.createSelectionColumn()];

    this.cols()?.forEach((col) => {
      columnDefs.push(this.createDataColumn(col));
    });

    if (this.hasContextMenu()) {
      columnDefs.push(this.createActionColumn());
    }

    return columnDefs;
  });

  public readonly sortingState = computed((): SortingState => {
    return this.sorting().map((sort) => ({
      id: sort.field,
      desc: sort.direction === 'desc',
    }));
  });

  public readonly sortingStateDict = computed(() => {
    const dict: Record<string, 'asc' | 'desc'> = {};
    this.sorting().forEach((sort) => {
      dict[sort.field] = sort.direction;
    });
    return dict;
  });

  public readonly range = computed(() => {
    const paging = this.paging();
    const dataLength = this.dataLength();

    return {
      start: paging.pageIndex * paging.pageSize + 1,
      end: paging.pageIndex * paging.pageSize + dataLength,
    };
  });

  public readonly hasContextMenu = computed(
    () => this.contextMenu().length > 0,
  );

  public readonly dataLength = computed(() => this.data().length);
  public readonly isTableView = computed(() => this.viewMode() === 'table');

  public readonly trackByRowId: TrackByFunction<{ id: string }> = (
    index: number,
    row: { id: string },
  ) => row.id;

  public readonly trackByCellId: TrackByFunction<{ id: string }> = (
    index: number,
    cell: { id: string },
  ) => cell.id;

  public readonly trackByHeaderId: TrackByFunction<{ id: string }> = (
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
          rowSelection: this.rowSelection(),
        },
        enableSorting: this.enableSorting(),
        enableSortingRemoval: true,
        enableRowSelection: true,
        manualSorting: this.serverSide(),
        onSortingChange: this.handleSortingChange,
        onRowSelectionChange: this.handleRowSelectionChange,
        getCoreRowModel: getCoreRowModel(),
        ...(this.serverSide()
          ? {}
          : { getSortedRowModel: getSortedRowModel() }),
      }));
    });
  }

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

  public getContextMenu(row: T): GridContextMenu<T>[] {
    return this.contextMenu().filter((m) => !m.visible || m.visible(row));
  }

  public rowClickHandle(row: Row<T>, data: T): void {
    if (this.toggleRowSelectOnRowClick()) {
      row.toggleSelected();
    } else {
      this.onRowClick(data);
    }
  }

  private readonly handleSortChange = (sorts: ITableSort[]) => {
    this.sorting.set(sorts);
    this.onSortChange.emit({ sorts });
  };

  private readonly handleSortingChange = (
    updaterOrValue: SortingState | ((old: SortingState) => SortingState),
  ) => {
    const newSorting =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(this.sortingState())
        : updaterOrValue;

    const sorts: ITableSort[] = newSorting.map((sort) => ({
      field: sort.id,
      direction: sort.desc ? 'desc' : 'asc',
    }));

    this.handleSortChange(sorts);
  };

  private readonly handleRowSelectionChange = (
    updater:
      | Record<string, boolean>
      | ((old: Record<string, boolean>) => Record<string, boolean>),
  ) => {
    const newValue =
      typeof updater === 'function' ? updater(this.rowSelection()) : updater;

    this.rowSelection.set(newValue);
  };

  private createSelectionColumn(): ColumnDef<T> {
    return {
      id: 'select',
      size: 20,
      enablePinning: true,
      enableSorting: false,
      header: () => flexRenderComponent(TableHeadSelectionComponent),
      cell: () => flexRenderComponent(TableRowSelectionComponent),
    };
  }

  private createDataColumn(col: MixTableColumnDirective): ColumnDef<T> {
    return {
      accessorKey: col.key(),
      enablePinning: false,
      enableSorting: this.enableSorting(),
      header: col.header(),
      id: col.key(),
      cell: col.tplCell?.template
        ? () => col.tplCell?.template
        : (info) => info.getValue(),
    };
  }

  private createActionColumn(): ColumnDef<T> {
    return {
      id: 'action',
      size: 20,
      enablePinning: true,
      enableSorting: false,
    };
  }
}
