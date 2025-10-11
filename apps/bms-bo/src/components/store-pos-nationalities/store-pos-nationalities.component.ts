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
import { MixInputListStringComponent } from '@mixcore/ui/input-list';
import { injectModalService } from '@mixcore/ui/modal';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastService } from '@mixcore/ui/toast';
import { BmsBranchStore } from '../../state';

@Component({
  selector: 'bms-store-pos-nationalities',
  templateUrl: './store-pos-nationalities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixTileComponent, MixInputListStringComponent, MixButtonComponent],
})
export class StorePosNationalitiesComponent extends BaseComponent {
  public bmsStore = inject(BmsBranchStore);
  public toast = injectToastService();
  public modalService = injectModalService();

  public bmsBranch = input.required<IBmsBranch>();
  public tempNationalities = signal<string[]>([]);

  constructor() {
    super();

    watch([this.bmsBranch], ([branch]) => {
      this.tempNationalities.set(branch.nationalities || []);
    });
  }

  public onSubmit() {
    this.modalService.asKForAction(
      'Are you sure to update nationalities?',
      () => {
        const branch = this.bmsBranch();
        const nationalities = this.tempNationalities().filter(
          (n) => n.trim() !== '',
        );

        this.bmsStore
          .updateData({ ...branch, nationalities })
          .pipe(this.observerLoadingState())
          .subscribe({
            next: () => {
              this.toast.success('Update nationalities successfully');
            },
          });
      },
    );
  }
}
