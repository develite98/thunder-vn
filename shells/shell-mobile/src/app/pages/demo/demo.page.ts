import { Component } from '@angular/core';
import { injectModalService } from '@mixcore/ui-mobile/modal';
import {
  MixSelectComplexComponent,
  MixSelectSimpleComponent,
} from '@mixcore/ui-mobile/select';

import { injectBottomSheet } from '@mixcore/ui-mobile/bottom-sheet';
import { MixDatePickerComponent } from '@mixcore/ui-mobile/calendar';
import { MixIconComponent } from '@mixcore/ui/icons';
import { BottomSheetWithAutoFocusComponent } from './bottom-sheet-with-auto-focus.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.page.html',
  imports: [
    MixSelectSimpleComponent,
    MixSelectComplexComponent,
    MixDatePickerComponent,
    MixIconComponent,
  ],
})
export class DemoPageComponent {
  public modal = injectModalService();
  public bottomSheet = injectBottomSheet();

  public selectItems = [
    {
      id: 1,
      displayName: 'Item 1',
    },
    {
      id: 2,
      displayName: 'Item 2',
    },
    {
      id: 3,
      displayName: 'Item 3',
    },
  ];

  public labelProcess = (item: { id: number; displayName: string }) =>
    item.displayName;

  public searchFn = (
    item: { id: number; displayName: string },
    searchText: string,
  ) => item.displayName.toLowerCase().includes(searchText.toLowerCase());

  public openModal() {
    this.modal.asKForAction('Do you want to delete data', () => {
      console.log('ok');
    });
  }

  public openModalWithAutoFocus() {
    this.bottomSheet.open(BottomSheetWithAutoFocusComponent);
  }
}
