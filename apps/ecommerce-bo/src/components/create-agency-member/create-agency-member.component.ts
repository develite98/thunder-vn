import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent, LoadingState } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { injectToastService } from '@mixcore/ui/toast';
import { injectDispatch } from '@ngrx/signals/events';
import { agencyDialogEvent } from '../../state';

@Component({
  selector: 'mix-create-agency-member',
  templateUrl: './create-agency-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixDialogWrapperComponent,
    MixButtonComponent,
    MixFormFieldComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class CreateAgencyMemberComponent extends BaseComponent {
  readonly toast = injectToastService();
  readonly event = injectDispatch(agencyDialogEvent);
  readonly dialogRef = injectDialogRef();
  readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', Validators.required],
    phone_number: ['', [Validators.required]],
    full_name: ['', Validators.required],
    created_date: [new Date()],
    role: [],
  });

  public onSumbit() {
    if (FormUtils.validateForm(this.form)) {
      this.loadingState.set(LoadingState.Loading);
      this.dialogRef.close(this.form.value);
    }
  }
}
