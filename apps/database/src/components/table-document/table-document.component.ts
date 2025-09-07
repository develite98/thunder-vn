import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EDataType, MixColumn } from '@mixcore/sdk-client';
import {
  injectDialogRef,
  MixWizardDialogWrapperComponent,
} from '@mixcore/ui/dialog';
import { IFormConfig, MixFormComponent } from '@mixcore/ui/forms';

@Component({
  selector: 'mix-db-table-document',
  templateUrl: './table-document.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixFormComponent, MixWizardDialogWrapperComponent],
})
export class DbTableDocument {
  public dialogRef = injectDialogRef();
  public column = this.dialogRef.data?.columns as MixColumn[];
  public data = this.dialogRef.data?.data as Record<string, any>;

  public form = new FormGroup({});
  public fields: IFormConfig[] = [];

  ngOnInit() {
    this.fields = this.column.map((c) => {
      const typeMap: Record<string, string> = {
        [EDataType.DateTime]: 'datePicker',
        [EDataType.Boolean]: 'checkbox',
        [EDataType.Html]: 'editor',
        [EDataType.Upload]: 'image',
      };

      const type = typeMap[c.dataType as unknown as string] || 'input';

      return {
        key: c.systemName,
        type: type,
        wrappers: ['simple'],
        props: {
          label: c.displayName,
          ...c.columnConfigurations,
        },
      };
    });
  }
}
