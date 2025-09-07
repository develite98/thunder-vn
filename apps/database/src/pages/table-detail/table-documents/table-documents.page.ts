import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { injectParams, injectQueryParams } from '@mixcore/router';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialog } from '@mixcore/ui/dialog';
import { GridContextMenu, MixTableModule } from '@mixcore/ui/table';
import { DbTableDocument } from 'apps/database/src/components';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { TableStore } from '../../../state';
import {
  DocumentQuery,
  TableDocumentStore,
} from '../../../state/stores/documents.store';

@Component({
  selector: 'mix-table-documents-page',
  templateUrl: './table-documents.page.html',
  imports: [MixTableModule, MixButtonComponent],
  providers: [TableDocumentStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DbTableDocumentsPage extends BasePageComponent {
  readonly queryParams = injectQueryParams();
  readonly tableId = injectParams('tableId');
  readonly documentStore = inject(TableDocumentStore);
  readonly tableStore = inject(TableStore);
  readonly dialog = injectDialog();

  readonly table = this.tableStore.selectEntityById(this.tableId);
  readonly tableState = this.tableStore.selectEntityStateById(this.tableId);

  readonly contextMenu: GridContextMenu<unknown>[] = [
    {
      label: 'common.delete',
      icon: 'trash-2',
      action: (item) => {},
      iconClass: 'text-error',
    },
  ];

  constructor() {
    super();

    explicitEffect([this.table, this.queryParams], ([table, param]) => {
      if (table) {
        const query = new DocumentQuery().default(10).withParams(param);
        query.tableSystemName = table.systemName;

        this.documentStore.search(query).subscribe();
      }
    });
  }

  public onCreateNew() {
    this.dialog.open(DbTableDocument, {
      windowClass: 'fullscreen-dialog',
      data: {
        columns: this.table()?.columns,
        data: {},
      },
    });
  }
}
