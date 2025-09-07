import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StringHelper } from '@mixcore/helper';

import { EMixContentStatus, MixQuery } from '@mixcore/sdk-client';
import { DialogService } from '@ngneat/dialog';
import {
  BreadcrumbComponent,
  CurrencyComponent,
  PublicFooterComponent,
  PublicHeaderComponent,
} from '../../components';
import { CartModalComponent } from '../../components/cart-modal/cart-modal.component';
import { CartStore } from '../../stores';
import {
  IPublicProductCategory,
  publicCategoryStore,
} from '../../stores/public-category.store';
import {
  IPublicProduct,
  publicProductListStore,
} from '../../stores/public-product.store';

import { injectQueryParam } from '@mixcore/router';
import { MixIconComponent } from '@mixcore/ui/icons';

@Component({
  selector: 'mix-products-page',
  imports: [
    PublicHeaderComponent,
    PublicFooterComponent,
    BreadcrumbComponent,
    CurrencyComponent,
    FormsModule,
    MixIconComponent,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
  providers: [publicProductListStore],
})
export class ProductsPageComponent {
  public searchText = injectQueryParam('keyword');
  public productStore = inject(publicProductListStore);
  public categoryStore = inject(publicCategoryStore);
  public cartStore = inject(CartStore);
  public dialog = inject(DialogService);
  public selectedCategory = signal<IPublicProductCategory | undefined>(
    undefined,
  );

  public priceFilter = signal<number>(5000000);
  public router = inject(Router);
  public activeRoute = inject(ActivatedRoute);

  public displayProducts = computed(() => {
    const category = this.selectedCategory();
    const products = this.productStore.dataEntities();
    const price = this.priceFilter();
    const searchText = this.searchText();

    return this.filter(products, category, price, searchText || '');
  });

  public breadcrumb = [
    {
      label: 'Trang chủ',
      url: '/',
    },
    {
      label: 'Danh sách sản phẩm',
      url: '/products',
    },
  ];

  constructor() {
    this.categoryStore
      .search(
        new MixQuery().default(10).equal('status', EMixContentStatus.Published),
      )
      .subscribe();

    this.productStore
      .search(
        new MixQuery()
          .default(100)
          .select(
            'title',
            'created_date_time',
            'price',
            'thumbnail',
            'price_list',
            'seo_url',
          )
          .equal('status', EMixContentStatus.Published),
      )
      .subscribe();
  }

  public addToCart(product: IPublicProduct) {
    this.cartStore.addItem({
      id: StringHelper.generateUUID(),
      quantity: 1,
      productId: product.id,
      thumbnail: product.thumbnail,
      title: product.title,
      price: product.price,
      systemNote: '',
      customerNote: '',
    });

    this.dialog.open(CartModalComponent, { data: { isAddNew: true } });
  }

  public goToProductDetail(id: number) {
    this.router.navigate(['/product', id]);
  }

  public filter(
    data: IPublicProduct[],
    category?: IPublicProductCategory,
    price: number = 10000000,
    searchText: string = '',
  ) {
    if (!data) return [];
    if (!category)
      return data.filter(
        (x) => x.price <= price && x.title.includes(searchText),
      );

    return data.filter(
      (x) =>
        category?.product_slugs?.includes(x.seo_url) &&
        x.price <= price &&
        x.title.includes(searchText),
    );
  }

  public getProductPrices(product: IPublicProduct) {
    return Object.entries(product.price_list || {}).map(([key]) => {
      return key;
    });
  }

  public handleChangeSearch(searchText: string) {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        keyword: searchText,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
