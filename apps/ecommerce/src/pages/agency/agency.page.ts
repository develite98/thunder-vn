import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent } from '@mixcore/base';
import { MixQuery } from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { MixButtonComponent } from '@mixcore/ui/buttons';
import { MixIconComponent } from '@mixcore/ui/icons';
import { injectModalService } from '@mixcore/ui/modal';
import { injectToastObserve } from '@mixcore/ui/toast';
import { defer } from 'rxjs';
import {
  BreadcrumbComponent,
  PublicFooterComponent,
  PublicHeaderComponent,
} from '../../components';
import { publicAgencyStore } from '../../stores';
import { AgencyMemberStore } from '../../stores/agency-member.store';

@Component({
  selector: 'ecom-agency',
  templateUrl: './agency.page.html',
  imports: [
    RouterModule,
    BreadcrumbComponent,
    PublicHeaderComponent,
    PublicFooterComponent,
    MixIconComponent,
    MixButtonComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class EcomAgencyPage extends BaseComponent {
  public client = injectMixClient();
  public toastObserve = injectToastObserve();
  public agencyMemberStore = inject(AgencyMemberStore);
  public agencyStore = inject(publicAgencyStore);
  public modal = injectModalService();

  public breadcrumbs = computed(() => {
    const agencies = this.agencyStore.dataEntities();
    const member = this.agencyMemberStore.dataEntities()[0];
    const agency = agencies.find((a) => a.id === member?.agency_id);

    return [
      {
        label: 'Trang chủ',
        url: '/',
      },
      {
        label: 'Đại lý',
        url: ``,
      },
      agency
        ? { label: agency.title, url: `` }
        : { label: 'Không tìm thấy đại lý', url: `` },
    ];
  });

  public authSesstionInvalid = signal<boolean | null>(false);
  public showError = signal(false);

  public loginForm = inject(NonNullableFormBuilder).group({
    username: [''],
    password: [''],
    rememberMe: [false],
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

            this.authSesstionInvalid.set(false);
            this.client.auth.initUserData().then(() => {
              this.loadAgencyInfo();
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

  public onLogOut() {
    this.modal.asKForAction('Are you sure to logout', () => {
      this.client.auth.logout(() => {
        this.authSesstionInvalid.set(true);
      });
    });
  }

  constructor() {
    super();

    this.authSesstionInvalid.set(this.client.auth.checkAuthSessionExpired());
    if (!this.authSesstionInvalid()) {
      this.client.auth.initUserData().then(() => {
        this.loadAgencyInfo();
      });
    }
  }

  public loadAgencyInfo() {
    const user = this.client.auth.currentUser;
    if (!user) return;

    const userName = user.userName;
    this.agencyMemberStore
      .search(new MixQuery().equal('username', userName))
      .subscribe();
  }
}
