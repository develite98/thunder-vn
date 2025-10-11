import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent } from '@mixcore/base';
import { FormUtils } from '@mixcore/helper';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import {
  MixFormFieldComponent,
  MixFormFieldErrorComponent,
  MixValidator,
} from '@mixcore/ui/forms';
import { MixInputPasswordComponent } from '@mixcore/ui/input';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MixFormFieldErrorComponent,
    MixFormFieldComponent,
    MixButtonComponent,
    MixInputPasswordComponent,
    TranslocoPipe,
  ],
})
export class RegisterFormComponent extends BaseComponent {
  public registerForm = inject(NonNullableFormBuilder).group(
    {
      email: ['', [MixValidator.requiredTrimmed]],
      password: ['', [MixValidator.requiredTrimmed, Validators.minLength(6)]],
      confirmPassword: ['', []],
    },
    { validators: MixValidator.missmatchFields('password', 'confirmPassword') },
  );

  public onSubmit() {
    FormUtils.validateForm$(this.registerForm)
      .then(() => {
        // handle form valid
      })
      .catch(() => {
        console.log(this.registerForm);
        // handle error
      });
  }
}
