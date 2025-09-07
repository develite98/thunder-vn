import { SlicePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MixQuery } from '@mixcore/sdk-client';
import { publicBannerStore, websiteBuilderStore } from '../../stores';
import {
  IPublicProductCategory,
  publicCategoryStore,
} from '../../stores/public-category.store';
import {
  IPublicProduct,
  publicProductStore,
} from '../../stores/public-product.store';

import { MixIconComponent } from '@mixcore/ui/icons';
import { register } from 'swiper/element/bundle';
import { EcomPinnedBlogsComponent } from '../pin-blogs/pin-blogs.component';
import { SearchInputComponent } from '../search-input/search-input.component';
register();

export interface IHomeBanner {
  homeBanners: HomeBanner[];
}

export interface HomeBanner {
  src: string;
  title: string;
  description: string;
  url: string;
}

export interface IHeaderCategory {
  categories: Category[];
}

export interface Category {
  title: string;
  products: Product[];
}

export interface Product {
  name: string;
  url: string;
}

@Component({
  selector: 'mix-swiper-section',
  imports: [
    SlicePipe,
    RouterLink,
    SearchInputComponent,
    MixIconComponent,
    EcomPinnedBlogsComponent,
  ],
  templateUrl: './swiper-section.component.html',
  styleUrl: './swiper-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperSectionComponent {
  public homeBanners = inject(publicBannerStore);
  public cats = inject(publicCategoryStore);
  public products = inject(publicProductStore);
  public builder = inject(websiteBuilderStore);
  public router = inject(Router);
  public banner = this.homeBanners.dataEntities;

  public getBlogsByCat(
    cat: IPublicProductCategory,
    products: IPublicProduct[],
  ) {
    return products
      .filter((products) => cat.product_slugs.includes(products.seo_url))
      .slice(0, 2);
  }

  constructor() {
    this.homeBanners.search(new MixQuery().default(5)).subscribe();
  }

  public onSearch(searchText: string) {
    this.router.navigate(['/products'], {
      queryParams: { keyword: searchText },
    });
  }

  public getSrc(url: string) {
    return url.startsWith('https://ecom.')
      ? url.replace('https://ecom.', 'https://')
      : `${url}`;
  }
}
