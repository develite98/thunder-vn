import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixTableModule } from '@mixcore/ui/table';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { debounceTime } from 'rxjs';
import { productDialogEvent, ProductStore } from '../../state';

@Component({
  selector: 'ecom-search-product',
  templateUrl: './search-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    MixTableModule,
    DatePipe,
  ],
  providers: [ProductStore],
})
export class SearchProductComponent extends BaseComponent {
  readonly toast = injectToastService();
  readonly event = injectDispatch(productDialogEvent);
  readonly dialogRef = injectDialogRef();
  readonly formControl = new FormControl('');
  readonly store = inject(ProductStore);

  public onSumbit() {
    //
  }

  constructor() {
    super();
    this.formControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (value) {
        const query = new MixQuery().default(100).like('title', value);
        this.store.search(query).subscribe();
      }
    });
  }
}
