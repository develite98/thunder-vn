import { DatePipe, SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MixQuery } from '@mixcore/sdk-client';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixTileComponent } from '@mixcore/ui/tile';
import { AppReleaseStore } from 'apps/system-dashboard/src/state';

@Component({
  selector: 'mix-releases-tile',
  templateUrl: './releases.component.html',
  imports: [
    MixTileComponent,
    MixIconComponent,
    SlicePipe,
    DatePipe,
    TranslocoPipe,
  ],
})
export class ReleaseTileComponent {
  readonly releaseStore = inject(AppReleaseStore);

  constructor() {
    this.releaseStore.search(new MixQuery()).subscribe();
  }
}
