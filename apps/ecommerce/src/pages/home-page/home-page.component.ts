import { Component } from '@angular/core';
import {
  PublicFooterComponent,
  PublicHeaderComponent,
  SwiperSectionComponent,
} from '../../components';
import { HomeProductsComponent } from '../../components/home-products/home-products.component';
import { MixHomeBlogsComponent } from '../../components/mix-home-blogs/mix-home-blogs.component';

@Component({
  selector: 'mix-home-page',
  imports: [
    PublicHeaderComponent,
    SwiperSectionComponent,
    HomeProductsComponent,
    PublicFooterComponent,
    MixHomeBlogsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
