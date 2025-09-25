import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '@mixcore/base';
import { ObjectUtils } from '@mixcore/helper';
import { ESortDirection, MixQuery } from '@mixcore/sdk-client';
import { IBranchArea, IBranchTable } from '@mixcore/shared-domain';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef } from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastService } from '@mixcore/ui/toast';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { forkJoin, Observable, switchMap, timer } from 'rxjs';
import { BranchAreaStore, BranchTableStore } from '../../state';

@Component({
  selector: 'mix-table-layout-edit',
  templateUrl: './table-layout-edit.component.html',
  styleUrls: ['./table-layout-edit.component.css'],
  imports: [DragDropModule, MixButtonComponent, MixIconComponent],
  encapsulation: ViewEncapsulation.None,
})
export class TableLayoutEditComponent extends BaseComponent {
  public dialogRef = injectDialogRef();
  public modal = injectModalService();
  public toast = injectToastService();

  public areaStore = inject(BranchAreaStore);
  public tableStore = inject(BranchTableStore);

  public selectedAreaId = signal<number | null>(null);
  public areas = signal<IBranchArea[]>([]);
  public tables = signal<IBranchTable[]>([]);

  public toSaveAreas = signal<number[]>([]);
  public toSaveTables = signal<number[]>([]);

  constructor() {
    super();

    explicitEffect([this.selectedAreaId], ([areaId]) => {
      if (!areaId) return;

      this.toSaveTables.set([]);
      this.tableStore
        .search(
          new MixQuery()
            .default(100)
            .sort('createdAt', ESortDirection.Desc)
            .equal('AreaId', areaId.toString()),
        )
        .subscribe();
    });

    explicitEffect([this.areaStore.dataEntities], ([areas]) => {
      if (this.isLoading()) return;
      this.initAreas(areas);
    });

    explicitEffect([this.tableStore.dataEntities], ([tables]) => {
      if (this.isLoading()) return;
      this.initTables(tables);
    });
  }

  ngOnInit() {
    this.selectedAreaId.set(this.areaStore.dataEntities()[0]?.id || null);
  }

  public onAreaDrop(event: CdkDragDrop<IBranchArea[]>) {
    let currentItems = [...this.areas()];
    let changedItems = [] as number[];

    moveItemInArray(currentItems, event.previousIndex, event.currentIndex);

    const areasDict = this.areaStore.dataEntityMap();
    currentItems = currentItems.map((item, index) => {
      const newPriority = index + 1;
      const oldPriority = areasDict[item.id]?.xAxis || 0;
      const value = {
        ...item,
        xAxis: newPriority,
      };

      if (newPriority !== oldPriority) changedItems.push(value.id);

      return value;
    });

    this.areas.set(currentItems);
    this.toSaveAreas.set(changedItems);
  }

  public onTableDrop(event: CdkDragDrop<IBranchTable[]>) {
    let currentItems = [...this.tables()];
    let changedItems = [] as number[];

    moveItemInArray(currentItems, event.previousIndex, event.currentIndex);

    const tableDict = this.tableStore.dataEntityMap();
    currentItems = currentItems.map((item, index) => {
      const newPriority = index + 1;
      const oldPriority = tableDict[item.id]?.priority || 0;
      const value = {
        ...item,
        priority: newPriority,
      };

      if (newPriority !== oldPriority) changedItems.push(value.id);

      return value;
    });

    this.tables.set(currentItems);
    this.toSaveTables.set(changedItems);
  }

  public onCancel() {
    this.toSaveAreas.set([]);
    this.toSaveTables.set([]);

    this.initAreas(this.areaStore.dataEntities());
    this.initTables(this.tableStore.dataEntities());
  }

  public initTables(tables: IBranchTable[]) {
    this.tables.set(
      ObjectUtils.clone(tables)
        .sort((a, b) => a.priority - b.priority)
        .filter((t) => t.isAvailable),
    );
  }

  public initAreas(areas: IBranchArea[]) {
    this.areas.set(
      ObjectUtils.clone(areas)
        .sort((a, b) => a.xAxis - b.xAxis)
        .filter((t) => t.isAvailable),
    );
  }

  public onSave() {
    this.modal.asKForAction('Are you sure to save theses changes?', () => {
      const { success: toastSuccess } = this.toast.loading('Saving changes...');
      const requests: Observable<void>[] = [];
      const areaChanges = this.areas().filter((x) =>
        this.toSaveAreas().includes(x.id),
      );

      if (areaChanges.length > 0) {
        areaChanges.forEach((area, index) =>
          requests.push(
            timer(index * 500).pipe(
              switchMap(() =>
                this.areaStore.updateData(area, {
                  success: () => {
                    this.toSaveTables.set(
                      this.toSaveAreas().filter((x) => x !== area.id),
                    );
                    this.toast.success(
                      `Area ${area.name} changes saved success!`,
                    );
                  },
                }),
              ),
            ),
          ),
        );
      }

      const tableChanges = this.tables().filter((x) =>
        this.toSaveTables().includes(x.id),
      );
      if (tableChanges.length > 0) {
        tableChanges.forEach((table, index) =>
          requests.push(
            timer(index * 500).pipe(
              switchMap(() =>
                this.tableStore.updateData(table, {
                  success: () => {
                    this.toSaveTables.set(
                      this.toSaveTables().filter((x) => x !== table.id),
                    );
                    this.toast.success(
                      `Table ${table.name} changes saved success!`,
                    );
                  },
                }),
              ),
            ),
          ),
        );
      }

      forkJoin(requests)
        .pipe(this.observerLoadingState())
        .subscribe({
          next: () => {
            this.toSaveTables.set([]);
            this.toSaveAreas.set([]);
            toastSuccess('All data changes have been saved!');
          },
        });
    });
  }

  public onClose() {
    if (!this.toSaveAreas().length && !this.toSaveTables().length) {
      this.dialogRef.close();
      return;
    }

    this.modal.asKForAction(
      'You have unsaved changes, are you sure to close?',
      () => {
        this.dialogRef.close();
      },
    );
  }
}
