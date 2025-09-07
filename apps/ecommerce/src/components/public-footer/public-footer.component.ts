import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MixCopyTextComponent } from '@mixcore/ui/copy-text';
import { injectDialog } from '@mixcore/ui/dialog';
import { injectUiConfig } from '../../helper';
import { publicAgencyStore } from '../../stores';
import { IStoreConfiguration } from '../../types';
import { ViewEmbedMapComponent } from '../view-map/view-map.component';

@Component({
  selector: 'mix-public-footer',
  imports: [RouterLink, MixCopyTextComponent],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
})
export class PublicFooterComponent {
  public store = inject(publicAgencyStore);
  public storeConfig = injectUiConfig<IStoreConfiguration>('store-config');
  public dialog = injectDialog();

  public showStore = input(true);

  public showMap(map: string | undefined) {
    this.dialog.open(ViewEmbedMapComponent, { data: { map } });
  }
}
