import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EMixDataType } from '@mixcore/sdk-client';
import { MixIconComponent } from '@mixcore/ui/icons';
import { DATA_TYPE_DISPLAY, IDataTypeDisplay } from '../../types';

@Component({
  selector: 'mix-table-column-type-icon',
  templateUrl: './table-column-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixIconComponent],
})
export class TableColumnTypeIconComponent {
  public column = input.required<IDataTypeDisplay, EMixDataType>({
    transform: (v: EMixDataType) => DATA_TYPE_DISPLAY[v],
  });
}
