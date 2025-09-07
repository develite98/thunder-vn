import { computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ObjectUtils } from '@mixcore/helper';
import { map as mapRxjs, switchMap } from 'rxjs';

export const injectParams = (key: string) => {
  const route = inject(ActivatedRoute);

  const mergedParams = toSignal<Record<string, string>>(
    route.pathFromRoot
      .map((r) => r.params)
      .reduce((acc, curr) =>
        acc.pipe(
          switchMap((prev) =>
            curr.pipe(mapRxjs((current) => ({ ...prev, ...current }))),
          ),
        ),
      ),
    { initialValue: null },
  );

  return computed(() => mergedParams()?.[key] || null);
};

export const injectQueryParam = (key: string) => {
  const paramsSignal = toSignal<Record<string, string>, Record<string, string>>(
    inject(ActivatedRoute).queryParams,
    {
      initialValue: <Record<string, string>>{},
    },
  );

  return computed(() => paramsSignal()?.[key] || null);
};

export const injectQueryParams = () => {
  const paramsSignal = toSignal<Record<string, string>, Record<string, string>>(
    inject(ActivatedRoute).queryParams,
    {
      initialValue: <Record<string, string>>{},
    },
  );

  return computed(() => ObjectUtils.clone(paramsSignal()) || null);
};
