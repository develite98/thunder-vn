import { Directive, computed, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, defer, tap } from 'rxjs';

export const enum LoadingState {
  Error = 'Error',
  Loading = 'Loading',
  Success = 'Success',
  Pending = 'Pending',
}

@Directive()
export abstract class BaseComponent {
  public trslSrv = inject(TranslocoService);
  public translate = this.trslSrv.translate.bind(this.trslSrv);

  public loadingState = signal(LoadingState.Pending);
  public isLoading = computed(
    () => this.loadingState() === LoadingState.Loading,
  );

  public isSuccess = computed(
    () => this.loadingState() === LoadingState.Success,
  );

  public observerLoadingState<T>(
    silentLoad = false,
  ): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => {
      return defer(() => {
        if (!silentLoad) this.loadingState.set(LoadingState.Loading);
        return source.pipe(
          tap({
            finalize: () => this.loadingState.set(LoadingState.Success),
            next: () => this.loadingState.set(LoadingState.Success),
            error: () => this.loadingState.set(LoadingState.Error),
          }),
        );
      });
    };
  }
}
