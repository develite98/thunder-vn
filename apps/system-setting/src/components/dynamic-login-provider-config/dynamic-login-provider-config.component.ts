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
  selector: 'app-dynamic-login-provider-config',
  templateUrl: './dynamic-login-provider-config.component.html',
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
export class DyanmicLoginProviderConfigComponent extends BaseComponent {
  public dialogRef = injectDialogRef();
  public title = this.dialogRef.data?.title || 'Google Login Provider Config';
  public description =
    this.dialogRef.data?.description || 'Configure Google Login Provider';
  public documentationUrl = this.dialogRef.data?.documentationUrl || '';

  public config = this.dialogRef.data?.config
    ? JSON.stringify(this.dialogRef.data.config)
    : '';

  public form = inject(FormBuilder).nonNullable.group({
    appId: [''],
    appSecret: [''],
    enable: [true],
  });

  ngOnInit() {
    this.form.patchValue({
      appId: this.dialogRef.data?.appId || '',
      appSecret: this.dialogRef.data?.appSecret || '',
      enable: this.dialogRef.data?.enable || false,
    });
  }

  onSubmit() {
    let toSavedConfig = {};
    try {
      toSavedConfig = JSON.parse(this.config);
    } catch {
      return;
    }

    this.dialogRef.close({
      config: toSavedConfig,
      appId: this.form.value.appId,
      appSecret: this.form.value.appSecret,
      enable: this.form.value.enable,
    });
  }
}
