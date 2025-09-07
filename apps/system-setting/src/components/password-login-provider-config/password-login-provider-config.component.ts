import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent } from '@mixcore/base';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixCodeEditorComponent } from '@mixcore/ui/code-editor';
import { injectDialogRef, MixDialogWrapperComponent } from '@mixcore/ui/dialog';
import { MixFormFieldComponent } from '@mixcore/ui/forms';
import { MixToggleComponent } from '@mixcore/ui/toggle';

@Component({
  selector: 'app-password-login-provider-config',
  templateUrl: './password-login-provider-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MixDialogWrapperComponent,
    MixToggleComponent,
    MixFormFieldComponent,
    MixCodeEditorComponent,
    MixButtonComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class PasswordLoginProviderConfigComponent extends BaseComponent {
  public dialogRef = injectDialogRef();
  public config = this.dialogRef.data?.config
    ? JSON.stringify(this.dialogRef.data.config)
    : '';

  public form = inject(FormBuilder).nonNullable.group({
    enable: [true],
  });

  ngOnInit() {
    this.form.patchValue({
      enable: this.dialogRef.data?.enable ?? true,
    });
  }

  onSubmit() {
    let toSavedConfig = {};
    try {
      toSavedConfig = JSON.parse(this.config || '{}');
    } catch {
      return;
    }

    this.dialogRef.close({
      config: toSavedConfig,
      enable: this.form.value.enable,
    });
  }
}
