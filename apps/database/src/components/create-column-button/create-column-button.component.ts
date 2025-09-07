import { Component, inject, input, ViewContainerRef } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { EMixDataType, MixTable } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialog } from '@mixcore/ui/dialog';
import { TippyDirective } from '@ngneat/helipopper';
import { DATA_TYPE_DISPLAY } from '../../types';
import { CreateColumnFormComponent } from '../create-column-form/create-column-form.component';
import { TableColumnTypeIconComponent } from '../table-column-icon/table-column-icon.component';

@Component({
  selector: 'mix-create-column-button',
  templateUrl: './create-column-button.component.html',
  imports: [
    MixButtonComponent,
    TranslocoPipe,
    TippyDirective,
    TableColumnTypeIconComponent,
  ],
})
export class CreateColumnButtonComponent {
  readonly dialog = injectDialog();
  readonly vcr = inject(ViewContainerRef);

  public table = input.required<MixTable>();

  public columnDisplay = DATA_TYPE_DISPLAY;
  public availableColumnTypes = [
    EMixDataType.String,
    EMixDataType.Integer,
    EMixDataType.Double,
    EMixDataType.Boolean,
    EMixDataType.DateTime,
    EMixDataType.Json,
    EMixDataType.Upload,
  ];

  public onSelect(type: EMixDataType) {
    this.dialog.open(CreateColumnFormComponent, {
      data: { type, table: this.table() },
      vcr: this.vcr,
    });
  }
}
