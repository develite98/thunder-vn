import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { EMixDataType, MixColumn } from '@mixcore/sdk-client';
import {
  injectDialogRef,
  MixWizardDialogWrapperComponent,
} from '@mixcore/ui/dialog';
import { IFormConfig, MixFormComponent } from '@mixcore/ui/forms';
import { TableDocumentStore } from '../../state/stores/documents.store';

const DB_SYSTEM_COLUMNS = ['id', 'created_by', 'createdBy'];

@Component({
  selector: 'mix-db-table-document',
  templateUrl: './table-document.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixFormComponent, MixWizardDialogWrapperComponent],
})
export class DbTableDocument extends BaseComponent {
  readonly documentStore = inject(TableDocumentStore);

  public dialogRef = injectDialogRef();
  public column = this.dialogRef.data?.columns as MixColumn[];
  public data = this.dialogRef.data?.data as Record<string, any>;
  public tableSystemName = this.dialogRef.data?.systemName as string;

  public form = new FormGroup({});
  public fields: IFormConfig[] = [];

  ngOnInit() {
    this.fields = this.column.map((c) => {
      const typeMap: Record<string, string> = {
        [EMixDataType.DateTime]: 'datePicker',
        [EMixDataType.Boolean]: 'checkbox',
        [EMixDataType.Html]: 'editor',
        [EMixDataType.Upload]: 'image',
        [EMixDataType.Json]: 'textarea',
      };

      const required = c.columnConfigurations?.isRequire ?? false;
      const type = typeMap[c.dataType as unknown as string] || 'input';
      const textInputType =
        c.dataType === EMixDataType.Integer ||
        c.dataType === EMixDataType.Double
          ? 'number'
          : 'text';

      return {
        key: c.systemName,
        type: type,
        wrappers: ['simple'],
        props: {
          label: c.displayName,
          type: textInputType,
          placeholder: `Enter ${c.displayName}`,
          required: required,
          readonly: DB_SYSTEM_COLUMNS.includes(c.systemName),
          ...c.columnConfigurations,
        },
      };
    });
  }

  onSubmit() {
    FormUtils.validateForm$(this.form).then((value) => {
      this.documentStore
        .createData({
          ...value,
          dbSystemName: this.tableSystemName,
        })
        .subscribe();
    });
  }
}
