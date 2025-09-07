import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MixQuery } from '@mixcore/sdk-client';
import { MixIconComponent } from '@mixcore/ui/icons';
import { DialogService } from '@ngneat/dialog';
import { injectUiConfig } from '../../helper';
import { CartStore, socialNetworkStore } from '../../stores';
import { IStoreConfiguration } from '../../types';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { SearchInputComponent } from '../search-input/search-input.component';

@Component({
  selector: 'mix-public-header',
  imports: [
    RouterModule,
    MixIconComponent,
    ReactiveFormsModule,
    SearchInputComponent,
  ],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHeaderComponent {
  public storeConfig = injectUiConfig<IStoreConfiguration>('store-config');
  public snStore = inject(socialNetworkStore);

  public cartStore = inject(CartStore);
  public dialog = inject(DialogService);
  public router = inject(Router);
  public searchText = new FormControl('');

  public isSticky = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky.set(window.scrollY > 120);
  }

  public onShowCart() {
    this.dialog.open(CartModalComponent);
  }

  public onSearch(searchText: string) {
    this.router.navigate(['/products'], {
      queryParams: { keyword: searchText },
    });
  }

  constructor() {
    this.snStore.search(new MixQuery().default(5)).subscribe();
  }

  public onSocialNetworkClick(link: string) {
    window.open(link, '_blank');
  }
}
