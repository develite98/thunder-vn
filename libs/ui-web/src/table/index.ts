import { NgModule } from '@angular/core';

import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixSelectComponent } from '@mixcore/ui/select';
import { MixTileComponent } from '@mixcore/ui/tile';
import { TippyDirective } from '@ngneat/helipopper';
import { FlexRenderDirective } from '@tanstack/angular-table';
import { ColumnVisibilityComponent } from './components/column-visibility.component';
import { MixInputQueryBuilderComponent } from './components/input-query-builder.component';
import {
  TableHeadSelectionComponent,
  TableRowSelectionComponent,
} from './components/selection.component';
import { TableSortComponent } from './components/table-sort.component';
import {
  MixTableCellDirective,
  MixTableColumnDirective,
  MixTableHeaderDirective,
} from './directive';
import { MixTableComponent } from './table/table.component';

@NgModule({
  declarations: [
    MixTableComponent,
    MixTableCellDirective,
    MixTableColumnDirective,
    MixTableHeaderDirective,
    TableRowSelectionComponent,
    TableHeadSelectionComponent,
  ],
  imports: [
    FlexRenderDirective,
    FormsModule,
    ReactiveFormsModule,
    MixIconComponent,
    MixTileComponent,
    NgTemplateOutlet,
    TranslocoPipe,
    TippyDirective,
    DragDropModule,
    TableSortComponent,
    MixSelectComponent,
    AsyncPipe,
    MixInputQueryBuilderComponent,
    ColumnVisibilityComponent,
    CdkCopyToClipboard,
  ],
  exports: [
    MixTableComponent,
    MixTableCellDirective,
    MixTableColumnDirective,
    MixTableHeaderDirective,
  ],
})
export class MixTableModule {}

export type {
  GridContextMenu,
  IColumnVisibility,
  IColumnVisibilityChange,
  ITableFilter,
  ITableSort,
  ITableSortChange,
} from './types';

export { ColumnVisibilityComponent } from './components/column-visibility.component';
