import { Component } from '@angular/core';

@Component({
  selector: 'mix-full-screen-page-container',
  template: `
    <div class="h-screen w-screen bg-base-100 fixed top-0 left-0 z-10">
      <ng-content></ng-content>
    </div>
  `,
  imports: [],
})
export class MixFullScreenPageContainerComponent {}
