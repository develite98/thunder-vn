import { Component, inject, signal } from '@angular/core';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { CulturesSelectComponent } from '@mixcore/ui/culture-select';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectToastObserve } from '@mixcore/ui/toast';

import { TenantSelectComponent } from '@mixcore/ui/tenant';
import { ThemeSelectComponent } from '@mixcore/ui/themes-select';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { injectAppConfig } from '@mixcore/app-config';
import { BaseComponent } from '@mixcore/base';

import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { defer } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    TranslocoPipe,
    ThemeSelectComponent,
    CulturesSelectComponent,
    TenantSelectComponent,
    MixButtonComponent,
    MixIconComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent extends BaseComponent {
  public router = inject(Router);
  public client = injectMixClient();
  public appSetting = injectAppConfig();
  public toastObserve = injectToastObserve();
  public translate = inject(TranslocoService);
  public loginForm = inject(NonNullableFormBuilder).group({
    username: [''],
    password: [''],
    rememberMe: [false],
  });

  public showError = signal(false);

  public onLogin() {
    this.showError.set(false);

    const request = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      rememberMe: this.loginForm.value.rememberMe,
    };

    defer(() =>
      this.client.auth.login(request, {
        success: (result) => {
          if (result?.redirectUrl) {
            const whiteLists = ['/auth/login', '/error'];

            const url = whiteLists.some((path) =>
              result.redirectUrl?.includes(path),
            )
              ? [result.redirectUrl]
              : ['/app/home'];

            this.router.navigate(url).catch(() => {
              this.router.navigate(['/app/home']);
            });
          } else {
            this.router.navigate(['/app/home']);
          }
        },
      }),
    )
      .pipe(
        this.observerLoadingState(),
        this.toastObserve({
          success: this.translate.translate('auth.login.success'),
          error: 'Error logging in, please try again.',
          loading: 'Trying to log you in...',
        }),
      )
      .subscribe();
  }
}
