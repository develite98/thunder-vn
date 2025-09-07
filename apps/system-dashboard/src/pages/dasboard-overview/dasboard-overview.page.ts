import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixPageContainerComponent } from '@mixcore/ui/page-container';
import { MixTileComponent } from '@mixcore/ui/tile';
import {
  ContributorsTileComponent,
  ReleaseTileComponent,
} from '../../components';
import { AppContributorStore, AppReleaseStore } from '../../state';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dasboard-overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixPageContainerComponent,
    MixTileComponent,
    MixIconComponent,
    ReleaseTileComponent,
    ContributorsTileComponent,
  ],
  providers: [AppReleaseStore, AppContributorStore],
})
export class DashboardOverviewPage extends BasePageComponent {}
