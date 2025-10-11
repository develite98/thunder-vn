import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { injectAppConfig } from '@mixcore/app-config';
import { BasePageComponent } from '@mixcore/base';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { CulturesSelectComponent } from '@mixcore/ui/culture-select';
import { TenantSelectComponent } from '@mixcore/ui/tenant';
import { ThemeSelectComponent } from '@mixcore/ui/themes-select';
import { RegisterFormComponent } from './register-form/register-form.component';

@Component({
  selector: 'app-register',
  imports: [
    TranslocoPipe,
    ThemeSelectComponent,
    CulturesSelectComponent,
    TenantSelectComponent,
    ReactiveFormsModule,
    RegisterFormComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent extends BasePageComponent {
  public client = injectMixClient();
  public appSetting = injectAppConfig();
}
