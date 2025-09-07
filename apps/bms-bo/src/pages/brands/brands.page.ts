import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '@mixcore/base';

@Component({
  selector: 'app-brands-page',
  templateUrl: './brands.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandsPageComponent extends BasePageComponent {}
