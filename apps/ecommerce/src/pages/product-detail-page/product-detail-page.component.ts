import { NgFor } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { StringHelper } from '@mixcore/helper';
import { MixIconComponent } from '@mixcore/ui/icons';
import { DialogService } from '@ngneat/dialog';
import {
  BreadcrumbComponent,
  PublicFooterComponent,
  PublicHeaderComponent,
} from '../../components';
import { CartModalComponent } from '../../components/cart-modal/cart-modal.component';
import { CurrencyComponent } from '../../components/currency/currency.component';
import { CartStore } from '../../stores';
import {
  IPublicProduct,
  publicProductStore,
} from '../../stores/public-product.store';

@Component({
  selector: 'mix-product-detail-page',
  imports: [
    PublicHeaderComponent,
    PublicFooterComponent,
    NgFor,
    BreadcrumbComponent,
    CurrencyComponent,
    MixIconComponent,
  ],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  public activeRoute = inject(ActivatedRoute);
  public cartStore = inject(CartStore);
  public productStore = inject(publicProductStore);
  public data = signal<IPublicProduct | null>(null);
  public quantity = signal<number>(1);
  public dialog = inject(DialogService);
  public selectedPrice = signal<{ label: string; value: number } | undefined>(
    undefined,
  );
  public santizer = inject(DomSanitizer);

  public increase() {
    this.quantity.update((x) => x + 1);
  }

  public decrease() {
    if (this.quantity() <= 1) {
      return;
    }

    this.quantity.update((x) => x - 1);
  }

  public getSrc(url: string) {
    return url.startsWith('https://ecom.')
      ? url.replace('https://ecom.', 'https://')
      : `${url}`;
  }

  public breadcrumb = [
    {
      label: 'Trang chủ',
      url: '/',
    },
    {
      label: 'Sản phẩm',
      url: '/product',
    },
    {
      label: 'Chi tiết sản phẩm',
      url: '',
    },
  ];

  public description = computed(() => {
    return this.santizer.bypassSecurityTrustHtml(
      this.data()?.description || '',
    );
  });

  public mainImage = signal<string>('');
  public thumbnails = signal<string[]>([]);

  constructor() {
    this.activeRoute.params.subscribe((params) => {
      this.productStore.getById(params['id']).subscribe((res) => {
        this.data.set(res);
        const images =
          res?.media?.mediaList?.map((x) => {
            return this.getSrc(x);
          }) || [];

        this.mainImage.set(images[0] || '');
        this.thumbnails.set(images);
      });
    });
  }

  public changeImage(src: string) {
    this.mainImage.set(src);
  }

  public addToCart() {
    const product = this.data();
    if (!product) return;

    this.cartStore.addItem({
      id: StringHelper.generateUUID(),
      quantity: this.quantity(),
      productId: product.id,
      thumbnail: product.thumbnail,
      title: product.title,
      price: this.selectedPrice()?.value || product.price,
      systemNote: this.selectedPrice()?.label || '',
    });

    this.dialog.open(CartModalComponent, { data: { isAddNew: true } });
  }

  public getProductAttributes(product: IPublicProduct) {
    return Object.entries(product.attributes || {}).map(([key, value]) => {
      return {
        label: key,
        value: value,
      };
    });
  }

  public getProductPrices(product: IPublicProduct) {
    return Object.entries(product.price_list || {}).map(([key, value]) => {
      return {
        label: key,
        value: value,
      };
    });
  }
}
