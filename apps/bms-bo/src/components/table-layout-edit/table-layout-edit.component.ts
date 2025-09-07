import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  Component,
  effect,
  inject,
  Pipe,
  PipeTransform,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { MixQuery } from '@mixcore/sdk-client';
import { IBranchArea, IBranchTable } from '@mixcore/shared-domain';
import { BranchAreaStore, BranchTableStore } from '../../state';

@Pipe({
  name: 'itemPriority',
  pure: true,
  standalone: true,
})
export class PriorityPipe implements PipeTransform {
  transform(items: (IBranchTable | IBranchArea)[]) {
    return items.sort((a, b) => a.priority - b.priority);
  }
}

@Component({
  selector: 'mix-table-layout-edit',
  templateUrl: './table-layout-edit.component.html',
  styleUrls: ['./table-layout-edit.component.css'],
  imports: [DragDropModule, PriorityPipe],
  encapsulation: ViewEncapsulation.None,
})
export class TableLayoutEditComponent {
  public areaStore = inject(BranchAreaStore);
  public tableStore = inject(BranchTableStore);

  public selectedAreaId = signal<number | null>(null);

  constructor() {
    effect(() => {
      const areaId = this.selectedAreaId();
      if (!areaId) return;

      this.tableStore
        .search(new MixQuery().default(100).equal('AreaId', areaId.toString()))
        .subscribe();
    });
  }

  ngOnInit() {
    this.selectedAreaId.set(this.areaStore.dataEntities()[0]?.id || null);
  }
}
