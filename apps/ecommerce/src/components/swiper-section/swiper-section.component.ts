import { SlicePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MixQuery } from '@mixcore/sdk-client';
import { publicBannerStore, websiteBuilderStore } from '../../stores';
import { publicCategoryStore } from '../../stores/public-category.store';
import {
  categoryProductStore,
  ICategoryProduct,
  IPublicProduct,
} from '../../stores/public-product.store';

import { MixIconComponent } from '@mixcore/ui/icons';
import { register } from 'swiper/element/bundle';
import { PrioritiyPipe } from '../../helper';
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
    PrioritiyPipe,
  ],
  templateUrl: './swiper-section.component.html',
  styleUrl: './swiper-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperSectionComponent {
  public homeBanners = inject(publicBannerStore);
  public cats = inject(publicCategoryStore);
  public catProdStore = inject(categoryProductStore);

  public builder = inject(websiteBuilderStore);
  public router = inject(Router);
  public banner = this.homeBanners.dataEntities;

  constructor() {
    this.homeBanners.search(new MixQuery().default(5)).subscribe();
  }

  public getCategoryProducts(catId: number, categories: ICategoryProduct[]) {
    return categories
      .filter((x) => x.category_id === catId)
      .map((x) => x.product)
      .filter((x) => x !== undefined) as IPublicProduct[];
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
