import { ApplicationRef, inject, Injectable } from '@angular/core';
import {
  CreateHotToastRef,
  HotToastService,
  ToastOptions,
} from '@ngxpert/hot-toast';
import { BehaviorSubject, defer, Observable, tap } from 'rxjs';
import { CustomToastComponent } from './custom-toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  public toast = inject(HotToastService);
  public appRef = inject(ApplicationRef);

  public observe<T>(
    message: {
      success: string;
      error: string;
      loading?: string;
    },
    options?: ToastOptions<T>,
  ): (source: Observable<T>) => Observable<T> {
    return (source) => {
      let ref: CreateHotToastRef<unknown>;

      const successMessage = message.success;
      const errorMessage = message.error ?? 'An error occurred';
      const loadingMessage = message.loading ?? 'Loading...';
      const time = new Date().getTime();
      const maxLoadingTime = 10000;
      const successTime = 3000;
      const errorTime = 10000;

      const observer = new BehaviorSubject<{ type: string; message: string }>({
        type: 'Loading',
        message: loadingMessage,
      });

      return defer(() => {
        if (loadingMessage) {
          ref = this.toast.show(CustomToastComponent, {
            ...options,
            duration: maxLoadingTime,
            data: { message: loadingMessage, type: 'Loading', observer },
          });
        }

        return source.pipe(
          tap({
            ...(successMessage && {
              next: () => {
                const date = new Date().getTime() - time;
                const toast = ref.getToast();
                toast.duration = date + successTime;
                ref.updateToast(toast);

                observer.next({ type: 'Success', message: successMessage });
              },
            }),
            ...(errorMessage && {
              error: () => {
                const date = new Date().getTime() - time;
                const toast = ref.getToast();
                toast.duration = date + errorTime;
                ref.updateToast(toast);

                observer.next({ type: 'Error', message: errorMessage });
              },
            }),
          }),
        );
      });
    };
  }

  public success<T>(message: string, options?: ToastOptions<T>) {
    const ref = this.toast.show(CustomToastComponent, {
      ...options,
      data: { message, type: 'Success' },
    });

    return ref;
  }

  public warning<T>(message: string, options?: ToastOptions<T>) {
    this.toast.show(CustomToastComponent, {
      ...options,
      data: { message, type: 'Warning' },
    });
  }

  public error<T>(message: string, options?: ToastOptions<T>) {
    this.toast.show(CustomToastComponent, {
      ...options,
      data: { message, type: 'Error' },
    });
  }

  public loading<T>(message: string, options?: ToastOptions<T>) {
    const time = new Date().getTime();
    const maxLoadingTime = 10000;
    const successTime = 3000;
    const errorTime = 10000;

    const observer = new BehaviorSubject<{ type: string; message: string }>({
      type: 'Loading',
      message: message,
    });

    const ref = this.toast.show(CustomToastComponent, {
      ...options,
      duration: maxLoadingTime,
      data: { message, type: 'Loading', observer },
    });

    const success = (message: string) => {
      const date = new Date().getTime() - time;
      const toast = ref.getToast();
      toast.duration = date + successTime;
      ref.updateToast(toast);
      observer.next({ type: 'Success', message });
    };

    const error = (message: string) => {
      const date = new Date().getTime() - time;
      const toast = ref.getToast();
      toast.duration = date + errorTime;
      ref.updateToast(toast);
      observer.next({ type: 'Error', message });
    };

    return { ref, success, error };
  }

  public info<T>(message: string, options?: ToastOptions<T>) {
    this.toast.show(CustomToastComponent, {
      ...options,
      data: { message, type: 'Info' },
    });
  }
}

export const injectToastService = () => {
  return inject(ToastService);
};

export const injectToastObserve = () => {
  const toastService = inject(ToastService);

  return toastService.observe.bind(toastService);
};
