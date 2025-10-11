import { Component, computed, inject, signal } from '@angular/core';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { CulturesSelectComponent } from '@mixcore/ui/culture-select';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectToastObserve, injectToastService } from '@mixcore/ui/toast';

import { TenantSelectComponent } from '@mixcore/ui/tenant';
import { ThemeSelectComponent } from '@mixcore/ui/themes-select';

import { TranslocoPipe } from '@jsverse/transloco';
import { ELoginProvider, injectAppConfig } from '@mixcore/app-config';
import { BaseComponent, injectTenant, LoadingState } from '@mixcore/base';

import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '@mixcore/firebase';
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
  providers: [],
})
export class LoginComponent extends BaseComponent {
  public firebase = inject(FirebaseService);
  public router = inject(Router);
  public client = injectMixClient();
  public appSetting = injectAppConfig();
  public tenant = injectTenant();

  public toast = injectToastService();
  public toastObserve = injectToastObserve();
  public loginForm = inject(NonNullableFormBuilder).group({
    username: [''],
    password: [''],
    rememberMe: [false],
  });

  public showError = signal(false);
  public googleLogin = computed(() => {
    return this.tenant
      .selectedTenant()
      ?.externalLoginProviders?.find((x) => x.Type === ELoginProvider.Google);
  });

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
              result.redirectUrl?.startsWith(path),
            )
              ? [result.redirectUrl]
              : ['/app/overview'];

            this.router.navigate(url).catch(() => {
              this.router.navigate(['/app/overview']);
            });
          }
        },
      }),
    )
      .pipe(
        this.observerLoadingState(),
        this.toastObserve({
          success: this.translate('auth.login.success'),
          error: 'Error logging in, please try again.',
          loading: 'Trying to log you in...',
        }),
      )
      .subscribe();
  }

  public onGoogleLogin() {
    const firebaseConfig = this.googleLogin()?.Config;
    if (!firebaseConfig) return;

    this.loadingState.set(LoadingState.Loading);
    try {
      this.firebase.init(firebaseConfig);
      this.firebase
        .loginWithGoogle()
        .then(async (user) => {
          if (user) {
            const idToken = await user.getIdToken();
            this.client.auth.externalLogin(
              {
                provider: 'Firebase',
                externalAccessToken: idToken,
                email: user.email || '',
                userName: user.email,
                phoneNumber: user.phoneNumber || null,
                data: {
                  avatar: user.photoURL || '',
                },
                rememberMe: this.loginForm.value.rememberMe,
              },
              {
                success: () => {
                  this.toast.success(this.translate('auth.login.success'));
                  this.router.navigate(['/app/overview']).catch(() => {
                    this.router.navigate(['/app/overview']);
                  });
                },
                error: () => {
                  this.loadingState.set(LoadingState.Pending);
                  this.showError.set(true);
                },
              },
            );
          } else {
            this.showError.set(true);
          }
        })
        .catch(() => {
          this.loadingState.set(LoadingState.Pending);
          this.showError.set(true);
        });
    } catch {
      this.loadingState.set(LoadingState.Pending);
    }
  }
}
