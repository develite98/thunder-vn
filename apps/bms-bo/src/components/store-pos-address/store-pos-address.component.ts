import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { BaseComponent } from '@mixcore/base';
import { IBmsBranch } from '@mixcore/shared-domain';
import { watch } from '@mixcore/signal';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectModalService } from '@mixcore/ui/modal';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastService } from '@mixcore/ui/toast';
import { BmsBranchStore } from '../../state';

@Component({
  selector: 'bms-store-pos-address',
  templateUrl: './store-pos-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixTileComponent, MixFormFieldComponent, MixButtonComponent],
})
export class StorePosAddressComponent extends BaseComponent {
  public bmsStore = inject(BmsBranchStore);
  public toast = injectToastService();
  public modalService = injectModalService();

  public bmsBranch = input.required<IBmsBranch>();
  public tempAddress = signal<string>('');

  constructor() {
    super();

    watch([this.bmsBranch], ([branch]) => {
      this.tempAddress.set(branch.address);
    });
  }

  public onSubmit() {
    this.modalService.asKForAction('Are you sure to update address?', () => {
      const branch = this.bmsBranch();
      const address = this.tempAddress();

      this.bmsStore
        .updateData({ ...branch, address })
        .pipe(this.observerLoadingState())
        .subscribe({
          next: () => {
            this.toast.success('Update address successfully');
          },
        });
    });
  }
}
