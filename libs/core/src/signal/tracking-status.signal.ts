import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export enum StateStatus {
  Init = 'Init',
  Loading = 'Loading',
  Adding = 'Adding',
  Updatting = 'Updating',
  Deleting = 'Deleting',
  Error = 'Error',
  Pending = 'Pending',
  Success = 'Success',
  SilentLoading = 'SilentLoading',
}

export function withStatus() {
  return signalStoreFeature(
    withState<{ status: StateStatus }>({ status: StateStatus.Init }),
    withComputed(({ status }) => ({
      isInit: computed(() => status() === StateStatus.Init),
      isPending: computed(() => status() === StateStatus.Pending),
      isLoading: computed(() => status() === StateStatus.Loading),
      isSilentLoading: computed(() => status() === StateStatus.SilentLoading),
      isSuccess: computed(() => status() === StateStatus.Success),
      error: computed(() => status() === StateStatus.Error),
    })),
  );
}
