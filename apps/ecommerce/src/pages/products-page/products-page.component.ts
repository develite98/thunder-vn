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
  categoryProductStore,
  IPublicProduct,
  publicProductListStore,
} from '../../stores/public-product.store';

import { DomSanitizer } from '@angular/platform-browser';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { injectQueryParam } from '@mixcore/router';
import { MixIconComponent } from '@mixcore/ui/icons';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { PrioritiyPipe } from '../../helper';

@Component({
  selector: 'mix-products-page',
  imports: [
    PublicHeaderComponent,
    PublicFooterComponent,
    BreadcrumbComponent,
    CurrencyComponent,
    FormsModule,
    MixIconComponent,
    PrioritiyPipe,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
  providers: [publicProductListStore],
})
export class ProductsPageComponent extends BaseComponent {
  public searchText = injectQueryParam('keyword');
  public router = inject(Router);
  public activeRoute = inject(ActivatedRoute);
  public santizer = inject(DomSanitizer);

  public productStore = inject(publicProductListStore);
  public categoryStore = inject(publicCategoryStore);
  public categoryProductStore = inject(categoryProductStore);

  public cartStore = inject(CartStore);
  public dialog = inject(DialogService);
  public selectedCategory = signal<IPublicProductCategory | undefined>(
    undefined,
  );

  public selectedCatId = computed(() => this.selectedCategory()?.id);

  public products = signal<IPublicProduct[]>([]);
  public priceFilter = signal<number>(5000000);
  public categoryDetail = this.categoryStore.selectEntityById(
    this.selectedCatId,
  );

  public description = computed(() => {
    const cat = this.categoryDetail();
    if (cat) {
      return this.santizer.bypassSecurityTrustHtml(cat.long_description || '');
    }
    return '';
  });

  public displayProducts = computed(() => {
    const products = this.products();
    const price = this.priceFilter();
    const searchText = this.searchText();

    return this.filter(products, price, searchText || '');
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
    super();

    this.categoryStore
      .search(
        new MixQuery()
          .default(10)
          .equal('status', EMixContentStatus.Published)
          .select('id', 'title'),
      )
      .subscribe();

    explicitEffect([this.selectedCategory], ([category]) => {
      this.loadingState.set(LoadingState.Loading);

      if (!category) {
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
          .subscribe({
            next: (result) => {
              this.products.set(result?.items || []);
              this.loadingState.set(LoadingState.Success);
            },
            error: () => {
              this.products.set([]);
              this.loadingState.set(LoadingState.Success);
            },
          });
      } else {
        this.categoryProductStore
          .search(new MixQuery().default(100).equal('category_id', category.id))
          .subscribe({
            next: (result) => {
              this.products.set(
                (result?.items
                  .map((x) => x.product)
                  .filter(Boolean) as IPublicProduct[]) || [],
              );
              this.loadingState.set(LoadingState.Success);
            },
            error: (err) => {
              this.products.set([]);
              this.loadingState.set(LoadingState.Success);
            },
          });

        this.categoryStore.getById(category.id).subscribe();
      }
    });
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
    price: number = 10000000,
    searchText: string = '',
  ) {
    if (!data) return [];

    return data.filter((x) => x.price <= price && x.title.includes(searchText));
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
