import { ISystemAuthenticationConfig } from '@mixcore/sdk-client';
import { injectMixClient } from '@mixcore/sdk-client-ng';
import { StateStatus, withStatus } from '@mixcore/signal';

import { ObjectUtils } from '@mixcore/helper';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export const AuthConfigStore = signalStore(
  {
    providedIn: 'root',
  },
  withState({
    config: <ISystemAuthenticationConfig | undefined>undefined,
  }),
  withStatus(),
  withMethods((store, api = injectMixClient()) => ({
    loadData: () => {
      patchState(store, (s) => ({ ...s, status: StateStatus.Loading }));

      return api.setting.getSetting<ISystemAuthenticationConfig>(
        'Authentication',
        {
          success: (result: ISystemAuthenticationConfig) => {
            patchState(store, (s) => ({
              ...s,
              config: result,
              status: StateStatus.Success,
            }));
          },
          error: () => {
            patchState(store, (s) => ({
              ...s,
              config: undefined,
              status: StateStatus.Error,
            }));
          },
        },
      );
    },
    saveData: (data: ISystemAuthenticationConfig) => {
      patchState(store, (s) => ({ ...s, status: StateStatus.Updatting }));

      return api.setting.updateSetting<ISystemAuthenticationConfig>(
        'Authentication',
        data,
        {
          success: () => {
            patchState(store, (s) => ({
              ...s,
              config: ObjectUtils.clone(data),
              status: StateStatus.Success,
            }));
          },
          error: () => {
            patchState(store, (s) => ({
              ...s,
              status: StateStatus.Error,
            }));
          },
        },
      );
    },
  })),
);
