import { Component, inject } from '@angular/core';
import { MixQuery } from '@mixcore/sdk-client';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixTileComponent } from '@mixcore/ui/tile';
import { AppContributorStore } from 'apps/system-dashboard/src/state';

@Component({
  selector: 'mix-contributors-tile',
  templateUrl: './contributors.component.html',
  imports: [MixTileComponent, MixIconComponent],
})
export class ContributorsTileComponent {
  readonly contributorStore = inject(AppContributorStore);

  constructor() {
    this.contributorStore.search(new MixQuery()).subscribe();
  }
}
