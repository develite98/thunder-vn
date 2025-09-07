import { Component } from '@angular/core';
import { MixInputAutoFocus } from '@mixcore/helper';

@Component({
  selector: 'app-bottom-sheet-with-auto-focus',
  template: `
    <div class="p-4">
      <input mixAutoFocus class="input input-bordered" />
    </div>
  `,
  imports: [MixInputAutoFocus],
})
export class BottomSheetWithAutoFocusComponent {}
