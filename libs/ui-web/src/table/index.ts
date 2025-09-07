import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixSelectComponent } from '@mixcore/ui/select';
import { MixTileComponent } from '@mixcore/ui/tile';
import { TippyDirective } from '@ngneat/helipopper';
import { FlexRenderDirective } from '@tanstack/angular-table';
import {
  TableHeadSelectionComponent,
  TableRowSelectionComponent,
} from './components/selection.component';
import {
  TableFilterComponent,
  TableFilterDisplayComponent,
} from './components/table-filter.component';
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
    TableFilterDisplayComponent,
    TableRowSelectionComponent,
    TableHeadSelectionComponent,
    TableFilterComponent,
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
  ITableFilter,
  ITableFilterValue,
  ITableSort,
  ITableSortChange,
} from './types';
