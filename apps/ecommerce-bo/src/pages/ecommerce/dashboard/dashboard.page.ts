import { Component } from '@angular/core';
import { MixTableModule } from '@mixcore/ui/table';

@Component({
  selector: 'mix-ecommerce-dashboard-page',
  templateUrl: './dashboard.page.html',
  standalone: true,
  imports: [MixTableModule],
  providers: [],
})
export class EcommerceDashboardPage {
  constructor() {}
}
