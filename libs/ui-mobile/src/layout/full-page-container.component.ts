import { Component } from '@angular/core';

@Component({
  selector: 'mix-full-page-container-m',
  template: `
    <div
      class="absolute bg-base-100 w-[100dvw] max-w-[500px] mx-auto h-[100dvh] top-0 left-0 flex flex-col overflow-auto"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class MixFullPageContainerComponent {}
