import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BasePageComponent } from '@mixcore/base';
import {
  EMixLoginProvider,
  ISystemAuthenticationConfig,
} from '@mixcore/sdk-client';
import { injectDialog } from '@mixcore/ui/dialog';
import { MixIconComponent } from '@mixcore/ui/icons';
import { MixTileComponent } from '@mixcore/ui/tile';
import { injectToastService } from '@mixcore/ui/toast';
import {
  DyanmicLoginProviderConfigComponent,
  GoogleLoginProviderConfigComponent,
  PasswordLoginProviderConfigComponent,
} from 'apps/system-setting/src/components';
import { AuthConfigStore } from 'apps/system-setting/src/state';

@Component({
  selector: 'app-auth-provider-page',
  templateUrl: './auth-provider.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MixTileComponent, MixIconComponent],
})
export class AuthProviderPage extends BasePageComponent {
  public store = inject(AuthConfigStore);
  public dialog = injectDialog();
  public toast = injectToastService();
  public translateSrv = inject(TranslocoService);
  public provider = EMixLoginProvider;

  public passwordAuthConfig = computed(() => {
    return this.store
      .config()
      ?.Authentication?.ClientLoginProviders?.find(
        (x) => x.Type === EMixLoginProvider.Password,
      );
  });

  public googleAuthClientConfig = computed(() => {
    return this.store
      .config()
      ?.Authentication?.ClientLoginProviders?.find(
        (x) => x.Type === EMixLoginProvider.Google,
      );
  });

  public googleAuthServerConfig = computed(() => {
    return this.store.config()?.Authentication?.Google;
  });

  public facebookAuthClientConfig = computed(() => {
    return this.store
      .config()
      ?.Authentication?.ClientLoginProviders?.find(
        (x) => x.Type === EMixLoginProvider.Facebook,
      );
  });

  public facebookAuthServerConfig = computed(() => {
    return this.store.config()?.Authentication?.Facebook;
  });

  public twitterAuthClientConfig = computed(() => {
    return this.store
      .config()
      ?.Authentication?.ClientLoginProviders?.find(
        (x) => x.Type === EMixLoginProvider.Twitter,
      );
  });

  public twitterAuthServerConfig = computed(() => {
    return this.store.config()?.Authentication?.Twitter;
  });

  constructor() {
    super();

    this.store.loadData();
  }

  public editGoogleConfig() {
    const googleClientConfig = this.googleAuthClientConfig();
    const googleServerConfig = this.googleAuthServerConfig();

    const ref = this.dialog.open(GoogleLoginProviderConfigComponent, {
      data: {
        appId: googleServerConfig?.AppId,
        appSecret: googleServerConfig?.AppSecret,
        enable: googleClientConfig?.Enable,
        config: googleClientConfig?.Config,
      },
    });

    ref.afterClosed$.subscribe((result) => {
      if (result) {
        const value =
          this.store.config() || ({} as ISystemAuthenticationConfig);

        const toSave = result as {
          enable: boolean;
          config: object;
          appId: string;
          appSecret: string;
        };

        const clientProviders =
          value.Authentication?.ClientLoginProviders || [];
        const index = clientProviders.findIndex(
          (x) => x.Type === EMixLoginProvider.Google,
        );
        if (index > -1) {
          clientProviders[index] = {
            Type: EMixLoginProvider.Google,
            Enable: toSave.enable,
            Config: toSave.config,
          };
        } else {
          clientProviders.push({
            Type: EMixLoginProvider.Google,
            Enable: toSave.enable,
            Config: toSave.config,
          });
        }

        value.Authentication = {
          ...(value.Authentication || {}),
          Google: {
            AppId: toSave.appId,
            AppSecret: toSave.appSecret,
          },
          ClientLoginProviders: clientProviders,
        };

        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translateSrv.translate('common.update.loading'),
        );

        this.store
          .saveData(value)
          .then(() => {
            toastSuccess(this.translateSrv.translate('common.update.success'));
          })
          .catch((error) => {
            toastError(
              this.translateSrv.translate('common.update.error', {
                error: error.message,
              }),
            );
          });
      }
    });
  }

  public editPasswordConfig() {
    const passwordClientConfig = this.passwordAuthConfig();

    const ref = this.dialog.open(PasswordLoginProviderConfigComponent, {
      data: {
        enable: passwordClientConfig?.Enable,
        config: passwordClientConfig?.Config,
      },
    });

    ref.afterClosed$.subscribe((result) => {
      if (result) {
        const value =
          this.store.config() || ({} as ISystemAuthenticationConfig);

        const toSave = result as {
          enable: boolean;
          config: object;
        };

        const clientProviders =
          value.Authentication?.ClientLoginProviders || [];

        const index = clientProviders.findIndex(
          (x) => x.Type === EMixLoginProvider.Password,
        );
        if (index > -1) {
          clientProviders[index] = {
            Type: EMixLoginProvider.Password,
            Enable: toSave.enable,
            Config: toSave.config,
          };
        } else {
          clientProviders.push({
            Type: EMixLoginProvider.Password,
            Enable: toSave.enable,
            Config: toSave.config,
          });
        }

        value.Authentication = {
          ...(value.Authentication || {}),
          ClientLoginProviders: clientProviders,
        };

        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translateSrv.translate('common.update.loading'),
        );

        this.store
          .saveData(value)
          .then(() => {
            toastSuccess(this.translateSrv.translate('common.update.success'));
          })
          .catch((error) => {
            toastError(
              this.translateSrv.translate('common.update.error', {
                error: error.message,
              }),
            );
          });
      }
    });
  }

  public editFacebookConfig() {
    const clientConfig = this.facebookAuthClientConfig();
    const serverConfig = this.facebookAuthServerConfig();

    const ref = this.dialog.open(DyanmicLoginProviderConfigComponent, {
      data: {
        appId: serverConfig?.AppId,
        appSecret: serverConfig?.AppSecret,
        enable: clientConfig?.Enable,
        config: clientConfig?.Config,
      },
    });

    ref.afterClosed$.subscribe((result) => {
      if (result) {
        const value =
          this.store.config() || ({} as ISystemAuthenticationConfig);

        const toSave = result as {
          enable: boolean;
          config: object;
          appId: string;
          appSecret: string;
        };

        const clientProviders =
          value.Authentication?.ClientLoginProviders || [];
        const index = clientProviders.findIndex(
          (x) => x.Type === EMixLoginProvider.Facebook,
        );
        if (index > -1) {
          clientProviders[index] = {
            Type: EMixLoginProvider.Facebook,
            Enable: toSave.enable,
            Config: toSave.config,
          };
        } else {
          clientProviders.push({
            Type: EMixLoginProvider.Facebook,
            Enable: toSave.enable,
            Config: toSave.config,
          });
        }

        value.Authentication = {
          ...(value.Authentication || {}),
          Google: {
            AppId: toSave.appId,
            AppSecret: toSave.appSecret,
          },
          ClientLoginProviders: clientProviders,
        };

        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translateSrv.translate('common.update.loading'),
        );

        this.store
          .saveData(value)
          .then(() => {
            toastSuccess(this.translateSrv.translate('common.update.success'));
          })
          .catch((error) => {
            toastError(
              this.translateSrv.translate('common.update.error', {
                error: error.message,
              }),
            );
          });
      }
    });
  }

  public editDyanmicConfig(
    type: EMixLoginProvider,
    clientConfig?: {
      Enable?: boolean;
      Config?: object;
    },
    serverConfig?: {
      AppId?: string;
      AppSecret?: string;
    },
  ) {
    const ref = this.dialog.open(DyanmicLoginProviderConfigComponent, {
      data: {
        appId: serverConfig?.AppId,
        appSecret: serverConfig?.AppSecret,
        enable: clientConfig?.Enable,
        config: clientConfig?.Config,
      },
    });

    ref.afterClosed$.subscribe((result) => {
      if (result) {
        const value =
          this.store.config() || ({} as ISystemAuthenticationConfig);

        const toSave = result as {
          enable: boolean;
          config: object;
          appId: string;
          appSecret: string;
        };

        const clientProviders =
          value.Authentication?.ClientLoginProviders || [];
        const index = clientProviders.findIndex((x) => x.Type === type);
        if (index > -1) {
          clientProviders[index] = {
            Type: type,
            Enable: toSave.enable,
            Config: toSave.config,
          };
        } else {
          clientProviders.push({
            Type: type,
            Enable: toSave.enable,
            Config: toSave.config,
          });
        }

        value.Authentication = {
          ...(value.Authentication || {}),
          Google: {
            AppId: toSave.appId,
            AppSecret: toSave.appSecret,
          },
          ClientLoginProviders: clientProviders,
        };

        const { success: toastSuccess, error: toastError } = this.toast.loading(
          this.translateSrv.translate('common.update.loading'),
        );

        this.store
          .saveData(value)
          .then(() => {
            toastSuccess(this.translateSrv.translate('common.update.success'));
          })
          .catch((error) => {
            toastError(
              this.translateSrv.translate('common.update.error', {
                error: error.message,
              }),
            );
          });
      }
    });
  }
}
